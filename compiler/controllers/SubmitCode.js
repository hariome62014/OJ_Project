const path = require('path');
const Problem = require('../shared/models/Problem');
const TestCase = require('../shared/models/TestCase');
const Submission = require('../shared/models/Submission');
const User = require('../shared/models/User');
const { generateFile, cleanupFile } = require('../services/fileService');
const { executeCpp } = require('../services/codeExecutionService');

const ERROR_PRIORITY = [
  'compilation',
  'segmentation',
  'memory',
  'timeout',
  'runtime'
];

const STATUS_MAP = {
  compilation: "Compilation Error",
  segmentation: "Segmentation Fault",
  memory: "Memory Limit Exceeded",
  timeout: "Time Limit Exceeded",
  runtime: "Runtime Error"
};

function determineFinalStatus(errorTypes, allPassed) {
  for (const type of ERROR_PRIORITY) {
    if (errorTypes.has(type)) {
      return STATUS_MAP[type];
    }
  }
  return allPassed ? 'Accepted' : 'Wrong Answer';
}


exports.submitSolution = async (req, res) => {

    // console.log("User",req.user);

  const { problemId, code, language = 'cpp', Sub_type } = req.body;
  const userId = req.user.id;

  

  try {
    // Validate input
    if (!code || code.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Empty code! Please provide some code to execute.',
      });
    }
    if (!problemId) {
      return res.status(400).json({
        success: false,
        error: 'Problem ID is required.',
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId).populate('samples');
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found.',
      });
    }

    // Select test cases
    let testCases = [];
    let isRunMode = Sub_type === 'run';

    if (isRunMode) {
      if (!problem.samples || problem.samples.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No samples found for this problem.',
        });
      }
      testCases = problem.samples.map(sample => ({
        input: sample.input,
        expectedOutput: sample.output,
        isPublic: true
      }));
    } else {
      testCases = await TestCase.find({ problemId });
      if (testCases.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No test cases found for this problem.',
        });
      }
    }

    // Generate code file
    const codesDir = path.join(__dirname, '../../codes');
    const filePath = await generateFile(codesDir, language, code);

    // Prepare results array
    const results = [];
    let allTestCasesPassed = true;
    let totalExecutionTime = 0;
    let maxExecutionTime = 0;
    let totalMemoryUsage = 0;
    let maxMemoryUsage = 0;
    const errorTypes = new Set();

    // Execute code against each test case
    for (const testCase of testCases) {
      let executionResult;
      try {
        executionResult = await executeCpp(
          filePath,
          testCase.input,
          problem.timeLimit,
          problem.memoryLimit
        );
      } catch (execError) {
        executionResult = {
          success: false,
          errorType: 'system',
          error: execError.message,
          output: '',
          executionTime: 0,
          memoryUsage: 0
        };
      }

      // Normalize outputs for comparison
      const normalizedExpected = (testCase.expectedOutput || '').trim().replace(/\r\n/g, '\n');
      const normalizedActual = (executionResult.output || '').trim().replace(/\r\n/g, '\n');

      const passed = executionResult.success && (normalizedExpected === normalizedActual);

      if (!passed) allTestCasesPassed = false;
      if (!executionResult.success && executionResult.errorType)
        errorTypes.add(executionResult.errorType);

      totalExecutionTime += executionResult.executionTime || 0;
      maxExecutionTime = Math.max(maxExecutionTime, executionResult.executionTime || 0);
      totalMemoryUsage += executionResult.memoryUsage || 0;
      maxMemoryUsage = Math.max(maxMemoryUsage, executionResult.memoryUsage || 0);

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: executionResult.output,
        executionTime: executionResult.executionTime,
        memoryUsage: executionResult.memoryUsage,
        isPublic: testCase.isPublic,
        passed,
        error: executionResult.error || null,
        errorType: executionResult.errorType || null
      });
    }

    // Clean up the generated file
    await cleanupFile(filePath);

    // Determine the submission status
    const status = determineFinalStatus(errorTypes, allTestCasesPassed);

    // Prepare response
    const response = {
      success: true,
      problemId,
      allTestCasesPassed,
      totalTestCases: testCases.length,
      passedTestCases: results.filter((r) => r.passed).length,
      maxExecutionTime,
      maxMemoryUsage,
      results,
      status,
      isRunMode
    };

    // Only save to database if this is a submission (not a run)
    if (!isRunMode) {
      const submissionResults = results.map(result => ({
        testCaseId: testCases.find(tc => tc.input === result.input)?._id || null,
        output: result.actualOutput,
        runtime: result.executionTime,
        memory: result.memoryUsage,
        passed: result.passed,
        error: result.error,
        errorType: result.errorType
      }));

      // Create new submission
      const submission = new Submission({
        problemId,
        userId,
        code,
        language,
        status,
        results: submissionResults,
        overallRuntime: maxExecutionTime,  // Using max instead of total
        overallMemory: maxMemoryUsage,    // Using max instead of total
        score: (response.passedTestCases / response.totalTestCases) * 100
      });

      await submission.save();

      // Update problem statistics
      const updateData = {
        $inc: { totalSubmissions: 1 }
      };

      if (status === 'Accepted') {
        updateData.$inc.correctSubmissions = 1;

        // Update user's solved problems if this is their first correct submission
        const user = await User.findById(userId);
        if (!user.solvedProblems.includes(problemId)) {
          await User.findByIdAndUpdate(
            userId,
            { $addToSet: { solvedProblems: problemId } }
          );
        }
      }

      // First update the submission counts
      const updatedProblem = await Problem.findByIdAndUpdate(
        problemId,
        updateData,
        { new: true } // Return the updated document
      );

      // Then calculate and update the acceptance rate
      if (updatedProblem.totalSubmissions > 0) {
        updatedProblem.acceptance = Math.round(
          (updatedProblem.correctSubmissions / updatedProblem.totalSubmissions) * 100
        );
        await updatedProblem.save();
      }

      // Add submission ID to the response
      response.submissionId = submission._id;
      // Also include acceptance rate in the response
      response.acceptanceRate = updatedProblem.acceptance;
    }

    res.json(response);
  } catch (error) {
    console.error('Error in submitSolution:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your submission.',
    });
  }
};