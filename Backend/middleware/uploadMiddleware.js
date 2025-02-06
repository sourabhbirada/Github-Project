const multer = require("multer");
const fs = require("fs");
const path = require("path");


const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

const uploadMiddleware = upload.array("files", 10);

module.exports = uploadMiddleware; 
