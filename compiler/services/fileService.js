// services/fileService.js
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const generateFile = async (dirPath, format, content) => {
  createDirectoryIfNotExists(dirPath);
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const filePath = path.join(dirPath, filename);
  await fs.promises.writeFile(filePath, content);
  return filePath;
};

const cleanupFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.error(`Error cleaning up file ${filePath}:`, err);
  }
};

module.exports = {
  generateFile,
  cleanupFile,
  createDirectoryIfNotExists,
};