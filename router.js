module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    const homeController = require('./controllers/homeController');
    const aboutController = require('./controllers/aboutController');
    const errorController = require('./controllers/errorController');
    const apiUploadController = require('./controllers/apiUploadController');
    const imageController = require('./controllers/imageController');
    const middlewares = require('./utils/middlewares');
    const config = require('./config');


    const { client } = require('./db');


    // Home page route
    router.get('/', homeController.renderHomePage);

    // About page route
    router.get('/about', aboutController.renderAboutPage);

    //api image upload
    router.post('/api/upload', middlewares.speedLimiter, middlewares.upload.single('file'), (req, res) => {
        apiUploadController.handleFileUpload(req, res, io, client, config.DB_NAME, config.COLLECTION_NAME)
    });

    //show image raw
    router.get('/image/:filename', (req, res) => {
        imageController.showImageRaw(req, res, client, config.DB_NAME, config.COLLECTION_NAME);
    });

    // error page route (redirecting to a random endpoint like /asjdfhg or /error [which doesnt exist] will redirect to error page)
    router.get(errorController.renderErrorPage);

    return router;
};