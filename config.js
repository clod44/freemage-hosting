require('dotenv').config();

//mongodb+srv:// ...
const MONGO_URI = process.env.MONGO_URI || null;
const DB_NAME = process.env.DB_NAME || 'main';
//this will contain a "dictionary" of random names and what file they will redirect to
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'image-mapping';
const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE || 5120; //kb
const UPLOAD_SPEED = process.env.UPLOAD_SPEED || 500; //kbps
const PORT = process.env.PORT || 3000;
const PAGE_RATE_LIMIT = process.env.PAGE_RATE_LIMIT || 7; //requests per ip adress per 10 seconds
const API_RATE_LIMIT = process.env.API_RATE_LIMIT || 3; //requests per ip adress per 10 seconds


module.exports = {
    MONGO_URI,
    DB_NAME,
    COLLECTION_NAME,
    MAX_UPLOAD_SIZE,
    UPLOAD_SPEED,
    PORT,
    PAGE_RATE_LIMIT,
    API_RATE_LIMIT
};
