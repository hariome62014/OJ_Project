const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const uploadImageToCloudinary = (buffer, folder, height, quality) => {
  return new Promise((resolve, reject) => {
    const options = { folder };
    if (height) options.height = height;
    if (quality) options.quality = quality;
    options.resource_type = "auto";

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadImageToCloudinary };
