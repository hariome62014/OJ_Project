const mongoose = require('mongoose');
const { Schema } = mongoose;

const testCaseSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem', // References the Problem model
      required: true,
    },
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // Hidden by default (only visible to admins)
    },
    weight: {
      type: Number,
      default: 1.0, // Default weight for scoring
      min: 0.1, // Minimum weight
      max: 10.0, // Maximum weight
    },
    explanation: {
      type: String, // Optional explanation for the test case
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster querying by problemId
testCaseSchema.index({ problemId: 1 });

// Create and export the TestCase model
const TestCase = mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;