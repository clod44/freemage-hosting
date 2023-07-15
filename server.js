const config = require('./config');
const path = require('path');
const express = require('express');
const http = require('http');

const router = require('./router');
const socketController = require('./controllers/socketController');
const { connectToMongoDB } = require('./db');
const { uploadedImageCount } = require('./utils/utils');


const app = express();

// Create the server
const server = http.createServer(app);
const io = require('socket.io')(server);

// Handle socket.io connections
io.on('connection', socketController.handleConnection);
io.on('disconnect', socketController.handleDisconnect);


// Configure the app
app.set('views', path.join(__dirname, 'ssi'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.use(router(io));


connectToMongoDB()

//server listen
server.listen(config.PORT, () => {
    console.log()
    console.log(`Server is listening on port ${config.PORT}`)
    console.log(`Serve upload speed limit: ${config.UPLOAD_SPEED}kbps`)
    console.log(`Serve api rate limit: ${config.API_RATE_LIMIT*6} per minute`)
    console.log(`Images in Filesystem: ${uploadedImageCount}`)
    console.log();
});




