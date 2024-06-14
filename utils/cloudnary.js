const cloudinary = require("cloudinary").v2; // Ensure using cloudinary.v2
const fileSystem = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Upload an image
const uploadFile = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary");
    console.log(response.url);
    return response;
  } catch (error) {
    fileSystem.unlinkSync(filePath); // Remove the locally saved file if the upload operation failed
    console.log(error.message);
    return null;
  }
};

module.exports = { uploadFile };
