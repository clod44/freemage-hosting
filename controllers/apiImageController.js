const yup = require('yup');
const fs = require('fs');
const path = require('path');
const { c } = require('../utils/utils')



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
            res.status(500).redirect("/error"); //some random endpoint to redirect to * error endpoint
            return;
        }

        ///// Validate Data
        const dataSchema = yup.object().shape({
            createdAt: yup.date().required(),
            seenBy: yup.number().integer().min(0).default(0),
            lastSeenAt: yup.date().default(() => new Date()),
            originalFilename: yup.string().required(),
            uniqueFilename: yup.string().required(),
        });
        dataSchema.validate(mappingData.value)
            .catch(error => {
                c(mappingData.value);
                c('Data validation failed:', error.message, true)
                return;
            });

        const originalFilename = mappingData.value.originalFilename;
        const uniqueFilename = mappingData.value.uniqueFilename;
        const filePath = path.resolve(__dirname, '..', 'uploads', originalFilename);

        // Check if the file exists in the filesystem
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                c('Error accessing file:' + err);
                //res.status(404).json({error:'Image not found in the filesystem'});
                //res.status(404).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
                res.status(404).redirect("/error"); //some random endpoint to redirect to * error endpoint
            } else {
                res.status(200).sendFile(filePath);
            }
        });
    } catch (err) {
        c('Error retrieving mapping from MongoDB:' + err, true);
        //res.status(500).send('Internal Server Error. Cant communicate with the database');
        //res.status(500).sendFile(path.join(__dirname, 'public', 'pageNotFound.html'));
        res.status(404).redirect("/error"); //some random endpoint to redirect to * error endpoint
    }
};

module.exports = {
    showImageRaw
};
