const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'], // Only allows these values
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    timeLimit: {
      type: Number, // in seconds
      required: true,
      min: 0.1, // Minimum 0.1 second
    },
    memoryLimit: {
      type: Number, // in MB
      required: true,
      min: 1, // Minimum 1MB
    },
    sampleInput: {
      type: String,
      required: true,
    },
    sampleOutput: {
      type: String,
      required: true,
    },
    testCases: [{
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String },
    }],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Create and export the Problem model
const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;