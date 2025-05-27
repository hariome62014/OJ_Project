const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp'], 
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'running',
        'accepted',
        'wrong answer',
        'time limit exceeded',
        'memory limit exceeded',
        'runtime error',
        'compilation error',
      ],
      default: 'pending',
    },
    results: [{
      testCaseId: {
        type: Schema.Types.ObjectId,
        ref: 'TestCase',
        required: true,
      },
      output: String, // Actual output from user's code
      runtime: Number, // in milliseconds
      memory: Number, // in MB
      passed: Boolean, // Whether output matches expected
    }],
    overallRuntime: Number, // Average runtime across test cases (ms)
    overallMemory: Number, // Peak memory usage (MB)
    score: Number, // Percentage of passed test cases
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for faster querying
submissionSchema.index({ problemId: 1, userId: 1 });
submissionSchema.index({ userId: 1, status: 1 });
submissionSchema.index({ createdAt: -1 }); // For getting latest submissions

// Calculate score before saving
submissionSchema.pre('save', function (next) {
  if (this.results && this.results.length > 0) {
    const passedCount = this.results.filter(r => r.passed).length;
    this.score = (passedCount / this.results.length) * 100;
    
    // Calculate average runtime and peak memory
    this.overallRuntime = this.results.reduce((sum, r) => sum + (r.runtime || 0), 0) / this.results.length;
    this.overallMemory = Math.max(...this.results.map(r => r.memory || 0));
  }
  next();
});

// Create and export the Submission model
const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;