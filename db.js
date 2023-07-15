const { MongoClient } = require('mongodb');
const config = require('./config');

const client = new MongoClient(config.MONGO_URI);
const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB successfully');
        return client; // Return the client instance
    } catch (err) {
        console.log('Error connecting to MongoDB:', true);
        throw err;
    }
};

module.exports = { 
    client,
    connectToMongoDB
};
