const mongoose = require('mongoose');
const { Schema } = mongoose;

console.log('Problem model is being initialized');

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard'
      },
      required: [true, 'Difficulty is required'],
      default: 'medium'
    },
    tags: {
      type: [String],
      required: [true, 'At least one tag is required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one tag is required'
      }
    },
    timeLimit: {
      type: Number,
      required: [true, 'Time limit is required']
    },
    memoryLimit: {
      type: Number,
      required: [true, 'Memory limit is required']
    },
    inputFormat: {
      type: String,
      required: [true, 'Input format description is required']
    },
    outputFormat: {
      type: String,
      required: [true, 'Output format description is required']
    },
    samples: {
      type: [{
        input: {
          type: String,
          required: [true, 'Sample input is required']
        },
        output: {
          type: String,
          required: [true, 'Sample output is required']
        },
        explanation: {
          type: String
        }
      }],
      required: [true, 'At least one sample is required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one sample is required'
      }
    },
    constraints: {
      type: String,
      required: [true, 'Constraints description is required']
    },
    testCases: [{
      type: Schema.Types.ObjectId,
      ref: 'TestCase'
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        if (!doc.showSolution) {
          delete ret.solution;
          delete ret.solutionExplanation;
        }
        if (!doc.showAllTestCases) {
          ret.testCases = ret.testCases?.filter(tc => tc.isPublic);
        }
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        if (!doc.showSolution) {
          delete ret.solution;
          delete ret.solutionExplanation;
        }
        if (!doc.showAllTestCases) {
          ret.testCases = ret.testCases?.filter(tc => tc && tc.isPublic);
        }
        return ret;
      }
    }
  }
);

// Corrected addTestCase method
problemSchema.methods.addTestCase = async function(testCaseId) {
  this.testCases.push(testCaseId);
  await this.save();
  return this;
};

problemSchema.methods.removeTestCase = async function(testCaseId) {
  // Validate inputs
  if (!testCaseId) {
    throw new Error('Test case ID is required');
  }
  
  // Convert to string once for comparison
  const testCaseIdStr = testCaseId.toString();
  
  // Safely filter out null/undefined values first
  this.testCases = this.testCases.filter(id => {
    // Skip if id is null/undefined
    if (!id) return false;
    
    // Compare string representations
    return id.toString() !== testCaseIdStr;
  });
  
  await this.save();
  return this;
};

// Indexing for search
problemSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual URL
problemSchema.virtual('url').get(function () {
  return `/problems/${this._id}`;
});

// Query helpers
problemSchema.query.byDifficulty = function (difficulty) {
  return this.where({ difficulty });
};

problemSchema.query.withSolution = function () {
  return this.setOptions({ showSolution: true });
};

problemSchema.query.withAllTestCases = function () {
  return this.setOptions({ showAllTestCases: true });
};

// Static method to find by author
problemSchema.statics.findByAuthor = function (authorId) {
  return this.find({ createdBy: authorId });
};

// Pre-save sanitization
problemSchema.pre('save', function (next) {
  if (this.tags) {
    this.tags = this.tags.map(tag => tag.trim().toLowerCase());
  }
  next();
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;