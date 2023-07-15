const fs = require('fs');
const path = require('path');


const showImageRaw = async (req, res, client, dbName, collectionName) => {
    //return
    const filename = req.params.filename;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

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
        const filePath = path.resolve(__dirname, '..', 'uploads', originalFilename);

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
};

module.exports = {
    showImageRaw
};
