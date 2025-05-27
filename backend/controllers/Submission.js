// submissionController.js
import Submission from '../models/Submission';
import Problem from '../models/Problem';
import { runCode } from '../utils/judgeService'; // Assume a code execution service

export const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user._id; // From auth middleware

    // Validate input
    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Problem ID, code, and language are required",
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Execute code (example using a mock judge)
    const executionResult = await runCode(code, language, problem.testCases);

    // Save submission
    const submission = await Submission.create({
      problem: problemId,
      user: userId,
      code,
      language,
      status: executionResult.passed ? "Accepted" : "Wrong Answer",
      runtime: executionResult.runtime,
      testCasesPassed: executionResult.passedTestCases,
    });

    res.status(201).json({
      success: true,
      message: "Solution submitted",
      data: submission,
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};