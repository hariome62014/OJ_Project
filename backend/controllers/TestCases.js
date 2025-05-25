const TestCase = require('../models/TestCase');
const Problem = require('../models/Problem');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const path = require('path');
const AdmZip = require('adm-zip');
const multer = require('multer');
const mongoose = require('mongoose')

// Helper function to parse test cases from text file
async function parseTestCasesFromFile(filePath, problemId) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const testCases = [];
    
    // Simple parsing logic - customize based on your file format
    const blocks = content.split('\n\n'); // Split by double newline
    
    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length >= 2) {
        testCases.push({
          problemId,
          input: lines[0].trim(),
          expectedOutput: lines[1].trim(),
          sourceType: 'file',
          originalFileName: filePath.split('/').pop()
        });
      }
    }
    
    return testCases;
  } catch (err) {
    throw new Error(`Failed to parse test cases: ${err.message}`);
  }
}

// Create multiple test cases from file
// Multer config for zip file upload
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.zip') {
      return cb(new Error('Only .zip files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');


// CRUD Operations
module.exports = {
  // Create single test case
createTestCase: async (req, res, next) => {
  try {
    console.log("Reached createTestCase");
    console.log("req.body", req.body);
    const { problemId } = req.params;
    const testCases = req.body;

    // Check if testCases is an array and not empty
    if (!Array.isArray(testCases)) {
      return res.status(400).json({ error: 'Request body must be an array of test cases' });
    }

    if (testCases.length === 0) {
      return res.status(400).json({ error: 'At least one test case is required' });
    }

    // Validate each test case in the array
    for (const testCase of testCases) {
      if (!testCase.input || !testCase.expectedOutput) {
        return res.status(400).json({ 
          error: 'Each test case must have both input and expectedOutput',
          invalidTestCase: testCase
        });
      }
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Create all test cases
    const createdTestCases = await TestCase.insertMany(
      testCases.map(testCase => ({
        problemId,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput
      }))
    );

    // Add each test case to the problem one by one
    for (const testCase of createdTestCases) {
      await problem.addTestCase(testCase._id);
    }

    res.status(201).json({
      success: true,
      count: createdTestCases.length,
      testCases: createdTestCases
    });
  } catch (err) {
    next(err);
  }
},

uploadTestCases :  (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
},

createTestCasesFromFile: async (req, res, next) => {
  try {
    console.log('1. Starting file processing...');
    const { problemId } = req.params;
    console.log(`2. Problem ID: ${problemId}`);

    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.error('3. Error: Problem not found in database');
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (!req.file) {
      console.error('4. Error: No file uploaded');
      return res.status(400).json({ error: 'ZIP file is required' });
    }
    console.log(`5. File received: ${req.file.originalname}, path: ${req.file.path}`);

    const zip = new AdmZip(req.file.path);
    const zipEntries = zip.getEntries();
    console.log(`6. ZIP entries found: ${zipEntries.length}`);

    // Debug: Log all entries in the ZIP
    console.log('7. All ZIP entries:');
    zipEntries.forEach(entry => {
      console.log(`- ${entry.entryName} (${entry.isDirectory ? 'DIR' : 'FILE'})`);
    });

    const createdTestCases = [];
    
    // Find all input files (handling nested paths)
    const inputFiles = zipEntries.filter(entry => {
      const normalizedPath = entry.entryName.replace(/\\/g, '/');
      return (
        /in\/input\d+\.txt$/i.test(normalizedPath) &&
        !entry.isDirectory
      );
    });
    console.log(`8. Found ${inputFiles.length} input files matching pattern`);

    if (inputFiles.length === 0) {
      console.error('9. Error: No input files found in /in/input*.txt');
    }

    for (const inputFile of inputFiles) {
      console.log(`10. Processing input file: ${inputFile.entryName}`);
      
      // Extract the number from input filename (e.g., "input1.txt" → 1)
      const inputNumber = path.basename(inputFile.entryName)
                            .match(/input(\d+)\.txt$/i)?.[1];
      
      if (!inputNumber) {
        console.warn(`11. Skipping: Could not extract number from filename ${inputFile.entryName}`);
        continue;
      }
      console.log(`12. Extracted input number: ${inputNumber}`);

      // Find matching output file (handling nested paths)
      const outputFileName = `output${inputNumber}.txt`;
      const outputFile = zipEntries.find(entry => {
        const normalizedPath = entry.entryName.replace(/\\/g, '/');
        return (
          normalizedPath.endsWith(`out/${outputFileName}`) &&
          !entry.isDirectory
        );
      });

      if (!outputFile) {
        console.warn(`13. No matching output file found for ${outputFileName}`);
        continue;
      }
      console.log(`14. Found matching output file: ${outputFile.entryName}`);

      const inputContent = inputFile.getData().toString('utf8').trim();
      const outputContent = outputFile.getData().toString('utf8').trim();
      console.log(`15. Input content (first 50 chars): ${inputContent.substring(0, 50)}`);
      console.log(`16. Output content (first 50 chars): ${outputContent.substring(0, 50)}`);

      try {
        const testCase = await TestCase.create({
          problemId,
          input: inputContent,
          expectedOutput: outputContent,
          isPublic: false,
          weight: 1.0,
          sourceType: 'file',
          originalFileName: `input${inputNumber}.txt`,
          metadata: {
            inputFile: inputFile.entryName,
            outputFile: outputFile.entryName
          }
        });
        console.log(`17. Created test case with ID: ${testCase._id}`);

        await problem.addTestCase(testCase._id);
        createdTestCases.push(testCase);
      } catch (err) {
        console.error('18. Error creating test case:', err.message);
        throw err;
      }
    }

    fs.unlinkSync(req.file.path);
    console.log('19. Temporary file cleaned up');

    if (createdTestCases.length === 0) {
      console.error('20. Final Error: No valid test case pairs created');
      return res.status(400).json({ 
        error: 'No valid test case pairs found in ZIP file',
        details: 'Expected structure: /in/input1.txt, /out/output1.txt, etc.',
        debug: {
          receivedFiles: zipEntries.map(e => e.entryName),
          matchedInputs: inputFiles.map(f => f.entryName)
        }
      });
    }

    console.log(`21. Successfully created ${createdTestCases.length} test cases`);
    res.status(201).json({
      success: true,
      message: `${createdTestCases.length} test cases created`,
      testCases: createdTestCases.map(tc => ({
        id: tc._id,
        inputFile: tc.metadata.inputFile,
        outputFile: tc.metadata.outputFile,
        createdAt: tc.createdAt
      }))
    });

  } catch (err) {
    console.error('22. Global Error Handler:', err.message);
    console.error(err.stack);
    
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('23. Cleaned up temp file after error');
    }
    next(err);
  }
},

  // Get all test cases for a problem
  getTestCases: async (req, res, next) => {
    try {
      const { problemId } = req.params;
      const { showAll } = req.query;


      
      const filter = { problemId };
      if (!showAll && !req.user?.isAdmin) {
        // filter.isPublic = true;
      }
      
      const testCases = await TestCase.find(filter);
      res.json(testCases);
    } catch (err) {
      next(err);
    }
  },
  
   // Update test case
  updateTestCase: async (req, res, next) => {
    try {
        console.log(req.params);
      const testCase = await TestCase.findById(req.params.testcaseID);
      
      if (!testCase) {
        return res.status(404).json({ error: 'Test case not found' });
      }
      
      const problem = await Problem.findById(testCase.problemId);
      
    
      
      const updated = await TestCase.findByIdAndUpdate(
        req.params.testcaseID,
        req.body,
        { new: true }
      );
      
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
  
  // Delete test case
 deleteTestCase : async (req, res, next) => {
  try {
    const { problemId, testCaseId } = req.params;

    console.log(`1. Deleting test case ${testCaseId} from problem ${problemId}`);

    // Find the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.error('2. Error: Problem not found');
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Find and verify the test case exists
    const testCase = await TestCase.findById(testCaseId);
    if (!testCase) {
      console.error('3. Error: Test case not found');
      return res.status(404).json({ error: 'Test case not found' });
    }

    // Remove from problem's testCases array
    console.log('4. Removing test case reference from problem');
    await problem.removeTestCase(testCaseId);

    // Delete the test case document
    console.log('5. Deleting test case document');
    await TestCase.findByIdAndDelete(testCaseId);

    console.log('6. Test case deleted successfully');
    res.status(204).json({
        success:true
    });

  } catch (err) {
    console.error('7. Error in deleteTestCase:', err.message);
    next(err);
  }
},

// Delete all the test cases of a Problem 

deleteAllTestCases : async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { problemId } = req.params;
    console.log(`1. Starting deletion of all test cases for problem ${problemId}`);

    // Validate problem ID
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      console.error('2. Error: Invalid problem ID format');
      return res.status(400).json({ error: 'Invalid problem ID format' });
    }

    // Find and verify the problem exists
    const problem = await Problem.findById(problemId).session(session);
    if (!problem) {
      console.error('3. Error: Problem not found');
      return res.status(404).json({ error: 'Problem not found' });
    }

    console.log(`4. Found problem with ${problem.testCases.length} test cases`);

    // Delete all test case documents
    const deleteResult = await TestCase.deleteMany(
      { problemId: problemId },
      { session }
    );
    console.log(`5. Deleted ${deleteResult.deletedCount} test case documents`);

    // Clear testCases array in problem
    problem.testCases = [];
    await problem.save({ session });
    console.log('6. Cleared test cases references from problem');

    await session.commitTransaction();
    console.log('7. Transaction committed successfully');

    res.status(200).json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} test cases`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (err) {
    await session.abortTransaction();
    console.error('8. Error in deleteAllTestCases:', err.message);
    next(err);
  } finally {
    session.endSession();
  }
}
}