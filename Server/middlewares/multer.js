const multer = require("multer");
const path = require("path");

// For images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

// For videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "videos");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadVideo };