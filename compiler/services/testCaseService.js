// services/testCaseService.js
const TestCase = require('../models/TestCase');

const getTestCasesByProblemId = async (problemId) => {
  return TestCase.find({ problemId }).lean();
};

const getPublicTestCasesByProblemId = async (problemId) => {
  return TestCase.find({ problemId, isPublic: true }).lean();
};

module.exports = {
  getTestCasesByProblemId,
  getPublicTestCasesByProblemId,
};