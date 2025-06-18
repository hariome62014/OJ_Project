



const path = require('path');
const crypto = require('crypto');
const pLimit = require('p-limit');
const Problem = require('../shared/models/Problem');
const TestCase = require('../shared/models/TestCase');
const Submission = require('../shared/models/Submission');
const User = require('../shared/models/User');
const { generateFile, cleanupFile } = require('../services/fileService');
const { executeCpp } = require('../services/codeExecutionService');

// Constants
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



// Configuration
const CONCURRENCY_LIMIT = 4; // Optimal for most systems
const concurrencyLimiter = pLimit(CONCURRENCY_LIMIT);

// Helper Functions
function determineFinalStatus(errorTypes, allPassed) {
  for (const type of ERROR_PRIORITY) {
    if (errorTypes.has(type)) {
      return STATUS_MAP[type];
    }
  }
  return allPassed ? 'Accepted' : 'Wrong Answer';
}

function quickNormalize(str) {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\r' && str[i+1] === '\n') {
      result += '\n';
      i++;
    } else {
      result += str[i];
    }
  }
  return result.trim();
}

function handleExecutionError(execError) {
  return {
    success: false,
    errorType: 'system',
    error: execError.message,
    output: '',
    executionTime: 0,
    memoryUsage: 0
  };
}

exports.submitSolution = async (req, res) => {
  const { problemId, code, language = 'cpp', Sub_type } = req.body;
  // console.log("User,",req.user)
  const userId = req.user.id;
  const isRunMode = Sub_type === 'run';

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

    // Check if problem exists with only necessary fields
    const problem = await Problem.findById(problemId)
      .select('timeLimit memoryLimit samples title')
      .populate('samples', 'input output');

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found.',
      });
    }

    // Select test cases
    let testCases = [];
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
      testCases = await TestCase.find({ problemId }).select('input expectedOutput isPublic');
      if (testCases.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No test cases found for this problem.',
        });
      }
    }

    // Generate code file with hash-based filename
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const codesDir = path.join(__dirname, '../../codes');
    const filePath = await generateFile(codesDir, language, code, codeHash);

    // Execute all test cases in parallel with concurrency limit
    const executionPromises = testCases.map(testCase => 
      concurrencyLimiter(() => 
        executeCpp(
          filePath,
          testCase.input,
          problem.timeLimit,
          problem.memoryLimit,
          codeHash
        ).catch(handleExecutionError)
      )
    );

    const executionResults = await Promise.all(executionPromises);

    // Process results
    const results = [];
    let allTestCasesPassed = true;
    const errorTypes = new Set();
    const stats = {
      totalExecutionTime: 0,
      maxExecutionTime: 0,
      totalMemoryUsage: 0,
      maxMemoryUsage: 0
    };

    executionResults.forEach((executionResult, index) => {
      const testCase = testCases[index];
      const normalizedExpected = quickNormalize(testCase.expectedOutput);
      const normalizedActual = quickNormalize(executionResult.output);
      const passed = executionResult.success && (normalizedExpected === normalizedActual);

      if (!passed) allTestCasesPassed = false;
      if (!executionResult.success && executionResult.errorType) {
        errorTypes.add(executionResult.errorType);
      }

      // Update statistics
      stats.totalExecutionTime += executionResult.executionTime || 0;
      stats.maxExecutionTime = Math.max(stats.maxExecutionTime, executionResult.executionTime || 0);
      stats.totalMemoryUsage += executionResult.memoryUsage || 0;
      stats.maxMemoryUsage = Math.max(stats.maxMemoryUsage, executionResult.memoryUsage || 0);

      results.push({
        input: isRunMode ? testCase.input : undefined,
        expectedOutput: isRunMode ? testCase.expectedOutput : undefined,
        actualOutput: isRunMode ? executionResult.output : (passed ? 'Correct' : 'Incorrect'),
        executionTime: executionResult.executionTime,
        memoryUsage: executionResult.memoryUsage,
        isPublic: testCase.isPublic,
        passed,
        error: executionResult.error || null,
        errorType: executionResult.errorType || null
      });
    });

    // console.log("Results:::",results)

    // Clean up the generated file
    await cleanupFile(filePath);

    // Determine the submission status
    const status = determineFinalStatus(errorTypes, allTestCasesPassed);

    const user = await User.findById(userId);

// Check if the problem was already solved
const alreadySolved = user.solvedProblems.includes(problemId);

// Prepare response
const response = {
  success: true,
  problemId,
  problemTitle: problem.title,
  allTestCasesPassed,
  totalTestCases: testCases.length,
  passedTestCases: results.filter(r => r.passed).length,
  avgExecutionTime: stats.totalExecutionTime / testCases.length,
  maxExecutionTime: stats.maxExecutionTime,
  avgMemoryUsage: stats.totalMemoryUsage / testCases.length,
  maxMemoryUsage: stats.maxMemoryUsage,
  results: isRunMode ? results : results.map(r => ({
    actualOutput: r.actualOutput,
    executionTime: r.executionTime,
    memoryUsage: r.memoryUsage,
    passed: r.passed,
    error: r.error,
    errorType: r.errorType
  })),
  status,
  isRunMode,
  newlySolved: allTestCasesPassed && !alreadySolved ? problemId : null, // Only send problemId if newly solved
};

    // Database operations for submissions only
    if (!isRunMode) {
      const session = await Problem.startSession();
      session.startTransaction();

      try {
        // Create submission
        const submission = new Submission({
          problemId,
          userId,
          code,
          language,
          status,
          results: results.map(result => ({
            testCaseId: testCases.find(tc => tc.input === result.input)?._id || null,
            output: result.actualOutput,
            runtime: result.executionTime,
            memory: result.memoryUsage,
            passed: result.passed,
            error: result.error,
            errorType: result.errorType
          })),
          overallRuntime: stats.maxExecutionTime,
          overallMemory: stats.maxMemoryUsage,
          score: (response.passedTestCases / response.totalTestCases) * 100
        });

        await submission.save({ session });

        // Update problem statistics
        const updatedProblem = await Problem.findByIdAndUpdate(
          problemId,
          {
            $inc: {
              totalSubmissions: 1,
              ...(status === 'Accepted' && { correctSubmissions: 1 })
            }
          },
          { new: true, session }
        );

        // Calculate acceptance rate
        if (updatedProblem.totalSubmissions > 0) {
          updatedProblem.acceptance = Math.round(
            (updatedProblem.correctSubmissions / updatedProblem.totalSubmissions) * 100
          );
          await updatedProblem.save({ session });
        }

        // Update user's solved problems if this is their first correct submission
        if (status === 'Accepted') {
          await User.findByIdAndUpdate(
            userId,
            { $addToSet: { solvedProblems: problemId } },
            { session }
          );
        }

        await session.commitTransaction();
        
        // Add submission details to response
        response.submissionId = submission._id;
        response.acceptanceRate = updatedProblem.acceptance;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    res.json(response);
  } catch (error) {
    // console.error('Error in submitSolution:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing your submission.',
    });
  }
};