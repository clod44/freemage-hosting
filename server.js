require('dotenv').config();
const path = require('path');
const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const slowDown = require('express-slow-down');
const uploadSpeedLimit = 100; // Specify the desired upload speed limit in kbps
// Calculate the delay in milliseconds based on the desired upload speed
const delayMs = Math.ceil((8 * 1000) / uploadSpeedLimit); // 8 bits = 1 byte
const speedLimiter = slowDown({
    windowMs: delayMs,
    delayAfter: 1, // Delay after the first request
    delayMs,
});

const app = express();

app.set('views', path.join(__dirname, 'ssi'));
app.set('view engine', 'ejs');
app.use(express.json());
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const originalExtension = path.extname(file.originalname);
        const uniqueFilename = `${Date.now()}_${uuidv4()}${originalExtension}`;
        cb(null, uniqueFilename);
    }
});


const upload = multer({ storage: storage });
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'main';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'image-mapping';


// Connect to MongoDB
const client = new MongoClient(MONGO_URI);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}
connectToMongoDB();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.render("index")
    //res.sendFile(__dirname + '/public/index.html');
});
app.get('/about', (req, res) => {
    res.render('about'); // Render the about.ejs view
});

app.post('/api/upload', speedLimiter, upload.single('file'), async (req, res) => {
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
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
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
    } catch (err) {
        console.log('Error storing mapping in MongoDB:', err);
    }

    // Handle the uploaded file here
    console.log('Original Filename:', originalFilename);
    console.log('Saved Filename:', uniqueFilename);

    res.status(200).json({ redirectUrl: `/image/${uniqueFilename}` });
});


app.get('/image/:filename', async (req, res) => {
    //res.status(200).send('file here');
    //return
    const filename = req.params.filename;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    try {
        const mappingData = await collection.findOneAndUpdate(
            { uniqueFilename: filename },
            { $inc: { seenBy: 1 }, $set: { lastSeenAt: new Date() } }
        );
        if (mappingData.ok != 1) {
            //res.status(404).json({error:'Image url not found in database'});
            //res.status(404).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
            res.redirect("/error"); //some random endpoint to redirect to * error endpoint
            return;
        }
        const originalFilename = mappingData.value.originalFilename;
        const filePath = __dirname + '/uploads/' + originalFilename;

        // Check if the file exists in the filesystem
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log('Error accessing file:', err);
                //res.status(404).json({error:'Image not found in the filesystem'});
                //res.status(404).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
                res.redirect("/error"); //some random endpoint to redirect to * error endpoint
            } else {
                res.sendFile(filePath);
            }
        });
    } catch (err) {
        console.error('Error retrieving mapping from MongoDB:', err);
        //res.status(500).send('Internal Server Error. Cant communicate with the database');
        //res.status(500).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
        res.redirect("/error"); //some random endpoint to redirect to * error endpoint
    }
});


app.get('*', (req, res) => {    //this needs to be placed after all other endpoint initilaizations
    res.status(404).render('pageNotFound');
});
