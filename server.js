const config = require('./config');
const path = require('path');
const express = require('express');
const http = require('http');
const { c } = require('./utils/utils')

const router = require('./router');
const socketController = require('./controllers/socketController');
const { connectToMongoDB } = require('./db');


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
    c();
    c(`Server is listening on port ${config.PORT}`)
    c(`Serve upload speed limit: ${config.UPLOAD_SPEED}kbps`)
    c(`Serve api rate limit: ${config.API_RATE_LIMIT}kbps`)
    c();
});




