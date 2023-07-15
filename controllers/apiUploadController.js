const path = require('path');
const { v4: uuidv4 } = require('uuid');
let { uploadedImageCount } = require('../utils/utils')


const handleFileUpload = async (req, res, io, client, dbName, collectionName) => {
    if (!req.file) {
        res.status(400).json({ error: 'Image Data not found in the request' });
        return;
    }

    // Get the original filename and extension
    const originalFilename = req.file.filename;
    const fileExtension = path.extname(originalFilename);

    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    // Store the mapping in the database
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const mappingData = {
        createdAt: new Date(),
        seenBy: 0,
        lastSeenAt: new Date(),
        originalFilename,
        uniqueFilename
    };

    try {
        await collection.insertOne(mappingData);
        console.log('Mapping data stored in MongoDB');
        uploadedImageCount++;
        io.emit('uploadedImageCount', uploadedImageCount);
    } catch (err) {
        console.log('Error storing mapping in MongoDB: ', err);
    }

    // Handle the uploaded file here
    console.log('Original Filename: '+ originalFilename);
    console.log('Saved Filename: '+ uniqueFilename);
    console.log()

    res.status(200).json({ redirectUrl: `/api/image/${uniqueFilename}` });
};




module.exports = {
    handleFileUpload
};
