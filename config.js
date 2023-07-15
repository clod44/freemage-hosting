require('dotenv').config();

const ENABLE_HTTPS = (process.env.ENABLE_HTTPS || false) === 'true';
const HTTP_PORT = parseInt(process.env.HTTP_PORT) || 2999;
const HTTPS_PORT = parseInt(process.env.HTTPS_PORT) || 3000;
//mongodb+srv:// ...
const MONGO_URI = process.env.MONGO_URI || '- missing MONGO_URI in .env -';
const DB_NAME = process.env.DB_NAME || 'main';
//this will contain a "dictionary" of random names and what file they will redirect to
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'image-mapping';
const MAX_UPLOAD_SIZE = parseInt(process.env.MAX_UPLOAD_SIZE) || 5120; //kb
const UPLOAD_SPEED = parseInt(process.env.UPLOAD_SPEED) || 500; //kbps
const PAGE_RATE_LIMIT = parseInt(process.env.PAGE_RATE_LIMIT) || 7; //requests per ip adress per 10 seconds
const API_RATE_LIMIT = parseInt(process.env.API_RATE_LIMIT) || 3; //requests per ip adress per 10 seconds

module.exports = {
    HTTP_PORT,
    HTTPS_PORT,
    ENABLE_HTTPS,
    MONGO_URI,
    DB_NAME,
    COLLECTION_NAME,
    MAX_UPLOAD_SIZE,
    UPLOAD_SPEED,
    PAGE_RATE_LIMIT,
    API_RATE_LIMIT
};
