const path = require('path');
const { executeCpp } = require('../services/codeExecutionService');
const { generateFile, cleanupFile } = require('../services/fileService');
const TestCase = require('../models/TestCase');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission'); // Import the Submission model

exports.submitSolution = async (req, res) => {
    console.log("Reached the Submit Solution Controller", req.user);
    const { problemId, code, language = 'cpp', Sub_type } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user ID is available

    console.log("Sub_type", Sub_type);

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

        let testCases = [];
        let isRunMode = Sub_type === 'run';

        if (isRunMode) {
            // In run mode, use the problem samples as test cases
            if (!problem.samples || problem.samples.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No samples found for this problem.',
                });
            }

            testCases = problem.samples.map(sample => ({
                input: sample.input,
                expectedOutput: sample.output,
                isPublic: true // Samples are always public
            }));
        } else {
            // In submit mode, use the actual test cases
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
                    executionTime: 0
                };
            }

            const testCaseResult = {
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: executionResult.output,
                executionTime: executionResult.executionTime,
                isPublic: testCase.isPublic,
            };

            if (executionResult.success) {
                // Normalize outputs for comparison
                const normalizedExpected = testCase.expectedOutput.trim().replace(/\r\n/g, '\n');
                const normalizedActual = executionResult.output.trim().replace(/\r\n/g, '\n');

                testCaseResult.passed = normalizedExpected === normalizedActual;
                testCaseResult.error = null;
            } else {
                testCaseResult.passed = false;
                testCaseResult.error = executionResult.error;
                allTestCasesPassed = false;
            }

            if (!testCaseResult.passed) {
                allTestCasesPassed = false;
            }

            totalExecutionTime += testCaseResult.executionTime;
            results.push(testCaseResult);
        }

        // Clean up the generated file
        await cleanupFile(filePath);

        // Determine the submission status
        let status;
        if (!allTestCasesPassed) {
            status = 'wrong answer';
        } else {
            status = 'accepted';
        }

        // Prepare response
        const response = {
            success: true,
            problemId,
            allTestCasesPassed,
            totalTestCases: testCases.length,
            passedTestCases: results.filter((r) => r.passed).length,
            totalExecutionTime,
            results,
            isRunMode
        };

        // Only save to database if this is a submission (not a run)
        if (!isRunMode) {
            // Map results to match the Submission schema
            const submissionResults = results.map(result => ({
                testCaseId: testCases.find(tc => tc.input === result.input)?._id || null,
                output: result.actualOutput,
                runtime: result.executionTime,
                memory: 0, // You might want to capture actual memory usage from executionResult
                passed: result.passed
            }));

            // Create new submission
            const submission = new Submission({
                problemId,
                userId,
                code,
                language,
                status,
                results: submissionResults,
                overallRuntime: totalExecutionTime / testCases.length,
                overallMemory: 0, // You might want to capture peak memory usage
                score: (response.passedTestCases / response.totalTestCases) * 100
            });

            // Save the submission to database
            await submission.save();
            
            // Add submission ID to the response
            response.submissionId = submission._id;
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