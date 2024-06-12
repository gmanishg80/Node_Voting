const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/temp")); // Use path.join to correctly handle the file path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Using the original file name
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
