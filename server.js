const config = require('./config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
const { version } = require('./package.json')
const router = require('./router');
const socketController = require('./controllers/socketController');
const { connectToMongoDB } = require('./db');
const { uploadedImageCount } = require('./utils/utils');


const app = express();

app.set('views', path.join(__dirname, 'ssi'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));



if (config.ENABLE_HTTPS) {
    // Create HTTPS server
    const options = {
        key: fs.readFileSync(path.resolve(__dirname, 'ssl', 'private-key.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'ssl', 'certificate.crt')),
    };
    const httpsServer = https.createServer(options, app);
    const httpsIo = require('socket.io')(httpsServer);
    app.use(router(httpsIo));

    // Handle socket.io connections
    httpsIo.on('connection', socketController.handleConnection);
    httpsIo.on('disconnect', socketController.handleDisconnect);


    //start actual server
    httpsServer.listen(config.HTTPS_PORT, () => {
        console.log()
        console.log(`Freemage Hosting ${version}`)
        console.log(`HTTPS Server is listening on port ${config.HTTPS_PORT}`)
        console.log(`Server upload speed limit: ${config.UPLOAD_SPEED}kbps`)
        console.log(`Server api rate limit: ${config.API_RATE_LIMIT * 6} per minute`)
        console.log(`Images in Filesystem: ${uploadedImageCount}`)
        console.log();
    });
    
} else {

    const httpServer = http.createServer(app);
    const httpIo = require('socket.io')(httpServer);
    app.use(router(httpIo));

    // Handle socket.io connections
    httpIo.on('connection', socketController.handleConnection);
    httpIo.on('disconnect', socketController.handleDisconnect);


    httpServer.listen(config.HTTP_PORT, () => {
        console.log()
        console.log(`Freemage Hosting ${version}`)
        console.log(`HTTP Server is listening on port ${config.HTTP_PORT}`)
        console.log(`Server upload speed limit: ${config.UPLOAD_SPEED}kbps`)
        console.log(`Server api rate limit: ${config.API_RATE_LIMIT * 6} per minute`)
        console.log(`Images in Filesystem: ${uploadedImageCount}`)
        console.log();
    });

}

connectToMongoDB()



