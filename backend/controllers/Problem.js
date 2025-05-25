const Problem = require('../models/Problem');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors/index');
const { validateProblemInput } = require('../validators/Problem');
const mongoose = require('mongoose')
const TestCase = require('../models/TestCase')
const Submission = require('../models/Submission')

// Helper function to format problem response
const formatProblemResponse = (problem, showAllTestCases = false) => {
  // Use lean() in your query or handle both document and object cases
  const response = problem.toObject ? problem.toObject() : problem;
  
  // Ensure testCases exists and is an array
  response.testCases = response.testCases || [];

  console.log("Reached formatProblemResponse")
  
  if (!showAllTestCases) {
    response.testCases = response.testCases.filter(tc => tc.isPublic);
  }
  
  return response;
};

exports.createProblem = async (req, res, next) => {
  try {
    // Validate input exists
    console.log("Reached create Problem controller")
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("Request body is empty")
      return res.status(400).json({
        success: false,
        error: 'Request body is empty'
      });
    }

    // Validate required user information
    if (!req.user || !req.user.id) {
      console.log("Authentication required")
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    console.log("req.body",req.body)

    // Prepare problem data
    const problemData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate test cases structure if provided
    // if (problemData.testCases) {
    //   if (!Array.isArray(problemData.testCases)) {
    //     return res.status(400).json({
    //       success: false,
    //       error: 'Test cases must be an array'
    //     });
    //   }

    //   for (const testCase of problemData.testCases) {
    //     if (!testCase.input || !testCase.output) {
    //       return res.status(400).json({
    //         success: false,
    //         error: 'Each test case must have both input and output'
    //       });
    //     }
    //   }
    // }

    // Create the problem
    const problem = await Problem.create(problemData);
    
    res.status(201).json({
      success: true,
      data: formatProblemResponse(problem, true)
    });
  } catch (err) {
    console.log("Error: Validation failed",err)
    // Handle Mongoose validation errors specifically
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        error: 'Validation failed',err,
        details: errors
      });
    }
    
    // Handle duplicate title error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.title) {
      return res.status(409).json({
        success: false,
        error: 'Problem with this title already exists'
      });
    }
    
    // Handle other types of errors
    next(err);
  }
};

exports.getAllProblems = async (req, res, next) => {
  try {
    console.log("Reached getAllProblems controller");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filtering
    const filter = {};
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    // Get problems with pagination
const [problems, total] = await Promise.all([
  Problem.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('testCases')
    .lean(),  // Optional: converts to plain JS objects
  Problem.countDocuments(filter)
]);

console.log("Problems:::6",problems)

    

    // Check if user is authenticated
    if (req.user) {
      // Get all problem IDs
      const problemIds = problems.map(p => p._id);

      // Find user's accepted submissions for these problems
      const acceptedSubmissions = await Submission.find({
        userId: req.user._id,
        problemId: { $in: problemIds },
        status: 'accepted'
      }).select('problemId');

      // Create a Set of solved problem IDs for quick lookup
      const solvedProblemIds = new Set(
        acceptedSubmissions.map(sub => sub.problemId.toString())
      );

      // Add solved status to each problem
    const problemsWithStatus = problems.map(problem => {
  const problemObj = problem.toObject();
  problemObj.solved = solvedProblemIds.has(problem._id.toString());
  problemObj.tags = problemObj.tags || []; // Ensure tags is always an array
  return problemObj;
});

      console.log("problemsWithStatus",problems)

      return res.json({
        success: true,
        data: problemsWithStatus,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }

    // For unauthenticated users, return problems without solved status
    res.json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};


exports.getProblemById = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    
    // Set query options before population
    const query = Problem.findById(req.params.problemId)
      .setOptions({ 
        showAllTestCases: isAdmin,
        showSolution: isAdmin 
      });
    
    // Only populate if needed
    if (isAdmin) {
      query.populate('testCases');
    } else {
      query.populate({
        path: 'testCases',
        match: { isPublic: true }
      });
    }
    
    const problem = await query;
    
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    res.json({
      success: true,
      data: problem
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProblem = async (req, res, next) => {
  try {
    
    
    
    const problem = await Problem.findById(req.params.problemId);
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    // Update problem fields
    Object.assign(problem, req.body);
    await problem.save();
    
    res.json({
      success: true,
      data: formatProblemResponse(problem, true)
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteProblem = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // 1. Verify problem exists and user has permission
      const problem = await Problem.findById(req.params.problemId)
      .session(session)
      .select('createdBy')
      .lean(); // Convert to plain JS object
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }

    // 2. Convert ObjectId to string for comparison
    const createdById = problem.createdBy.toString();
    const currentUserId = req.user?.id?.toString();

    // 3. Authorization check
    // const isAdmin = req.user?.role === 'admin';
    console.log("createdById",createdById)
    console.log("currentUserId",currentUserId)
    const isOwner = createdById === currentUserId;
    
    if (!isOwner) {
      throw new ForbiddenError('You are not authorized to delete this problem');
    }

    // 3. Cascade delete related data in transaction
    await Promise.all([
      // Delete the problem
      Problem.findByIdAndDelete(req.params.problemId).session(session),
      
      // Delete related test cases
      TestCase.deleteMany({ problemId: req.params.problemId }).session(session),
      
      // Clean up submissions (mark as deleted rather than actual delete)
      Submission.updateMany(
        { problem: req.params.problemId },
        { $set: { problemDeleted: true } }
      ).session(session),
      
      // Clean up any problem-related discussions
      // Discussion.deleteMany({ problem: req.params.problemId }).session(session),
      
      // Remove from user favorites
      // User.updateMany(
      //   { favoriteProblems: req.params.problemId },
      //   { $pull: { favoriteProblems: req.params.problemId } }
      // ).session(session)
    ]);

    // 4. Commit transaction
    await session.commitTransaction();
    
    // 5. Invalidate any relevant caches
    // (Implementation depends on your caching system)
    // invalidateCache(`problem:${req.params.problemId}`);
    // invalidateCache('problems:all');

    res.json({
      success: true,
      data: { 
        id: req.params.problemId,
        deleted: true,
        timestamp: new Date().toISOString() 
      }
    });
  } catch (err) {
    // 6. Abort transaction on error
    // await session.abortTransaction();
    
    // 7. Handle specific error cases
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid problem ID'));
    }
    
    // 8. Check for database integrity errors
    if (err.code === 13 || err.code === 14) { // MongoDB permission errors
      return next(new ForbiddenError('Database operation not permitted'));
    }
    
    next(err);
  } finally {
    // 9. End session
    session.endSession();
  }
};