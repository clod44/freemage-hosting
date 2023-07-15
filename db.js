const { MongoClient } = require('mongodb');
const config = require('./config');
const { c } = require('./utils/utils')

const client = new MongoClient(config.MONGO_URI);
const connectToMongoDB = async () => {
    try {
        await client.connect();
        c('Connected to MongoDB successfully');
        return client; // Return the client instance
    } catch (err) {
        c('Error connecting to MongoDB:', true);
        throw err;
    }
};

module.exports = { 
    client,
    connectToMongoDB
};
