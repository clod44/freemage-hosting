require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || null;
const DB_NAME = process.env.DB_NAME || 'main';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'image-mapping';
const UPLOAD_SPEED = process.env.UPLOAD_SPEED || 500;
const PORT = process.env.PORT || 3000;

module.exports = {
    MONGO_URI,
    DB_NAME,
    COLLECTION_NAME,
    UPLOAD_SPEED,
    PORT
};
