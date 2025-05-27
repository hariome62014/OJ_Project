const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);
const { createDirectoryIfNotExists } = require('./fileService');

const executeCpp = async (filePath, input, timeLimit = 2, memoryLimit = 256) => {
  const outputDir = path.join(__dirname, '../../outputs');
  await createDirectoryIfNotExists(outputDir);
  
  const jobId = path.basename(filePath).split('.')[0];
  const outPath = path.join(outputDir, `${jobId}.exe`);

  // Compile the C++ code
  try {
    await execPromise(`g++ ${filePath} -o ${outPath}`);
  } catch (compileError) {
    return {
      success: false,
      errorType: 'compilation',
      error: compileError.stderr,
      output: '',
      executionTime: 0,
    };
  }

  // Execute the compiled code
  let stdout = '';
  let stderr = '';
  let executionTime = 0;
  
  try {
    const startTime = process.hrtime();
    let childProcess;
    
    const executionPromise = new Promise((resolve, reject) => {
      childProcess = spawn(outPath, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        childProcess.kill();
        reject({
          killed: true,
          error: `Execution timed out after ${timeLimit} seconds`,
        });
      }, timeLimit * 1000);

      // Handle input
      if (input) {
        childProcess.stdin.write(input);
        childProcess.stdin.end();
      }

      // Collect output
      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      childProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          reject({
            killed: false,
            stderr: stderr || `Process exited with code ${code}`,
            exitCode: code
          });
        } else {
          resolve();
        }
      });

      childProcess.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
    });

    await executionPromise;
    const [seconds, nanoseconds] = process.hrtime(startTime);
    executionTime = seconds + nanoseconds / 1e9;

    return {
      success: true,
      output: stdout,
      error: stderr,
      executionTime,
    };
  } catch (execError) {
    return {
      success: false,
      errorType: execError.killed ? 'timeout' : 'runtime',
      error: execError.stderr || execError.error || execError.message,
      output: stdout, // Might contain partial output
      executionTime: execError.killed ? timeLimit : executionTime,
    };
  } finally {
    await cleanupExecutable(outPath);
  }
};

// Helper function to clean up executable with retries
async function cleanupExecutable(filePath, retries = 3, delay = 500) {
  if (!fs.existsSync(filePath)) return;

  for (let i = 0; i < retries; i++) {
    try {
      fs.unlinkSync(filePath);
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error(`Failed to delete executable after ${retries} attempts:`, err);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = {
  executeCpp,
};