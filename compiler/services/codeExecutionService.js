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
    await execPromise(`g++ "${filePath}" -o "${outPath}"`);
  } catch (compileError) {
    return {
      success: false,
      errorType: 'compilation',
      error: compileError.stderr || compileError.message,
      output: '',
      executionTime: 0,
      memoryUsage: 0,
    };
  }

  // Windows-specific memory monitoring
  const getMemoryUsage = async (pid) => {
    try {
      const { stdout } = await execPromise(
        `wmic process where "ProcessId=${pid}" get WorkingSetSize /Value`
      );
      
      const memoryLine = stdout.split('\r\r\n').find(line => line.startsWith('WorkingSetSize='));
      if (!memoryLine) return 0;
      
      const memoryBytes = parseInt(memoryLine.split('=')[1], 10);
      if (isNaN(memoryBytes)) return 0;
      
      return memoryBytes / (1024 * 1024); // Convert bytes to MB
    } catch {
      return 0;
    }
  };

  // Execute the compiled code
  let stdout = '';
  let stderr = '';
  let executionTime = 0;
  let memoryUsage = 0;
  let childProcess;

  try {
    const startTime = process.hrtime();
    
    const executionPromise = new Promise((resolve, reject) => {
      childProcess = spawn(outPath, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      });

      // Cleanup handlers
      const cleanup = () => {
        clearInterval(memoryMonitor);
        clearTimeout(timeoutId);
      };

      // Memory monitoring
      const memoryMonitor = setInterval(async () => {
        if (!childProcess.pid) return;
        try {
          const currentMem = await getMemoryUsage(childProcess.pid);
          memoryUsage = Math.max(memoryUsage, currentMem);

          if (currentMem > memoryLimit) {
            cleanup();
            childProcess.kill();
            reject({
              killed: true,
              error: `Memory limit exceeded (${currentMem.toFixed(2)}MB > ${memoryLimit}MB)`,
              memoryUsage: currentMem,
            });
          }
        } catch (err) {
          console.error('Memory monitoring error:', err);
        }
      }, 100);

      // Timeout handling
      const timeoutId = setTimeout(() => {
        cleanup();
        childProcess.kill();
        reject({
          killed: true,
          error: `Execution timed out after ${timeLimit} seconds`,
          memoryUsage,
        });
      }, timeLimit * 1000);

      // Input handling with EPIPE protection
      const handleInput = async () => {
        return new Promise((resolve) => {
          if (!input) return resolve();

          childProcess.stdin.on('error', (err) => {
            if (err.code !== 'EPIPE') {
              console.error('Input pipe error:', err);
            }
            resolve();
          });

          if (childProcess.stdin.writable) {
            childProcess.stdin.write(input, (err) => {
              if (err && err.code !== 'EPIPE') {
                console.error('Input write error:', err);
              }
              resolve();
            });
            childProcess.stdin.end();
          } else {
            resolve();
          }
        });
      };

      // Output collection
      childProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Process exit handling
      childProcess.on('close', (code, signal) => {
        cleanup();
        if (code === -1073741819) { // 0xC0000005 (ACCESS_VIOLATION)
          reject({
            killed: false,
            stderr: 'Segmentation fault (core dumped)',
            exitCode: code,
            signal,
            memoryUsage,
          });
        } else if (code !== 0) {
          reject({
            killed: false,
            stderr: stderr || `Process exited with code ${code}`,
            exitCode: code,
            signal,
            memoryUsage,
          });
        } else {
          resolve();
        }
      });

      childProcess.on('error', (err) => {
        cleanup();
        console.error('Child process failed to start:', err);
        reject({
          ...err,
          memoryUsage,
        });
      });

      // Start input handling
      handleInput().catch(err => {
        cleanup();
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
      memoryUsage,
    };
  } catch (execError) {
    let errorType = 'runtime';
    if (execError.killed) {
      errorType = execError.error?.includes('Memory limit') ? 'memory' : 'timeout';
    } else if (execError.exitCode === -1073741819) {
      errorType = 'segmentation';
    }

    return {
      success: false,
      errorType,
      error: execError.stderr || execError.error || execError.message,
      output: stdout,
      executionTime: execError.killed ? timeLimit : executionTime,
      memoryUsage: execError.memoryUsage || memoryUsage,
    };
  } finally {
    if (childProcess) {
      childProcess.kill();
    }
    await cleanupExecutable(outPath);
  }
};

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
