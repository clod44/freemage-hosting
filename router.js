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

    //limit max requests. 
    //ORDER MATTERS! first check if "/" rate limit is reached, then check if ...
    router.use('/', middlewares.rateLimiterPage)
    router.use('/api', middlewares.rateLimiterApi)

    // Routing
    router.get('/', homeController.renderHomePage);
    router.get('/about', aboutController.renderAboutPage);
    router.post('/api/upload', middlewares.uploadSpeedLimiter, middlewares.uploadMulter.single('file'), (req, res) => {
        apiUploadController.handleFileUpload(req, res, io, client, config.DB_NAME, config.COLLECTION_NAME)
    });
    router.get('/api/image/:filename', (req, res) => {
        imageController.showImageRaw(req, res, client, config.DB_NAME, config.COLLECTION_NAME);
    });

    // error page route (redirecting to a random endpoint like /asjdfhg or /error [which doesnt exist] will redirect to notFound page)
    router.get(errorController.renderErrorPage);

    return router;
};