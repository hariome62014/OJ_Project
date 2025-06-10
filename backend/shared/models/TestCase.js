const mongoose = require('mongoose');
const { Schema } = mongoose;

// const testCaseSchema = new Schema(
//   {
//     problemId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Problem', // References the Problem model
//       required: true,
//     },
//     input: {
//       type: String,
//       required: true,
//     },
//     expectedOutput: {
//       type: String,
//       required: true,
//     },
//     isPublic: {
//       type: Boolean,
//       default: false, // Hidden by default (only visible to admins)
//     },
//     weight: {
//       type: Number,
//       default: 1.0, // Default weight for scoring
//       min: 0.1, // Minimum weight
//       max: 10.0, // Maximum weight
//     },
//     explanation: {
//       type: String, // Optional explanation for the test case
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// // Index for faster querying by problemId
// testCaseSchema.index({ problemId: 1 });

// // Create and export the TestCase model
// const TestCase = mongoose.model('TestCase', testCaseSchema);
// module.exports = TestCase;


const testCaseSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
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
      default: false,
    },
    weight: {
      type: Number,
      default: 1.0,
      min: 0.1,
      max: 10.0,
    },
    explanation: {
      type: String,
    },
    // Add these new fields
    sourceType: {
      type: String,
      enum: ['manual', 'file'],
      default: 'manual'
    },
    originalFileName: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed, // Flexible structure for metadata
      default: {}
    }
  },
  {
    timestamps: true,
  }
);

// Index for faster querying by problemId
testCaseSchema.index({ problemId: 1 });

// Create and export the TestCase model
const TestCase = mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;