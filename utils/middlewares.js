const slowDown = require('express-slow-down');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config')
const rateLimit = require('express-rate-limit');

// Calculate the delay in milliseconds based on the desired upload speed
const delayMs = Math.ceil((8 * 1000) / config.UPLOAD_SPEED); // 8 bits = 1 byte
const uploadSpeedLimiter = slowDown({
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

const uploadMulter = multer({
    storage,
    limits: {
        fileSize: config.MAX_UPLOAD_SIZE * 1024,
        files: 1
    },
});



const rateLimiterPage = rateLimit({
    keyGenerator: (req) => {
        return req.ip;
    },
    windowMs: 10 * 1000, // 1 minute
    max: config.PAGE_RATE_LIMIT, // Maximum number of requests per IP address
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests' });
    },
});


const rateLimiterApi = rateLimit({
    keyGenerator: (req) => {
        return req.ip;
    },
    windowMs: 60 * 1000, // 1 minute
    max: config.API_RATE_LIMIT, // Maximum number of requests per IP address
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many Image requests per minute. please wait a minute' });
    },
});


// Export the router
module.exports = {
    rateLimiterPage,
    rateLimiterApi,
    uploadSpeedLimiter,
    uploadMulter
};
