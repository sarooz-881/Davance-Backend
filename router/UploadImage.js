const express = require("express");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./gallery/uploadImages",

  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp)$/i))
  //(/\.(doc|docx|pdf)$/)
  {
    let err = new Error("Only image files are allowed");
    err.status = 400;
    return cb(err, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 1920 * 1080 },
});

uploadRouter = express.Router();
uploadRouter.route("/")
.post(upload.array("myImg",10), (req, res, next) => {
    res.json(req.file);
});

module.exports = uploadRouter;
