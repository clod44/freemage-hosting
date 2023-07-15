const slowDown = require('express-slow-down');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config')


// Calculate the delay in milliseconds based on the desired upload speed
const delayMs = Math.ceil((8 * 1000) / config.UPLOAD_SPEED); // 8 bits = 1 byte
const speedLimiter = slowDown({
    windowMs: delayMs,
    delayAfter: 1, // Delay after the first request
    delayMs,
});




const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const originalExtension = path.extname(file.originalname);
        const uniqueFilename = `${Date.now()}_${uuidv4()}${originalExtension}`;
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage });



// Export the router
module.exports = {
    speedLimiter,
    upload
};
