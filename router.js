module.exports = (io) => {
    const express = require('express');
    const router = express.Router();

    const homeController = require('./controllers/homeController');
    const aboutController = require('./controllers/aboutController');
    const errorController = require('./controllers/errorController');
    const apiUploadController = require('./controllers/apiUploadController');
    const apiVersionController = require('./controllers/apiVersionController');
    const imageController = require('./controllers/apiImageController');
    const middlewares = require('./utils/middlewares');
    const config = require('./config');


    const { client } = require('./db');

    //limit max requests. 
    //ORDER MATTERS! first check if "/" rate limit is reached, then check if ...
    router.use('/', middlewares.rateLimiterPage)
    router.use('/api', middlewares.rateLimiterApi)

    //Just allow the CORS thing
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    // Routing
    router.get('/', homeController.renderHomePage);
    router.get('/about', aboutController.renderAboutPage);
    router.get('/api/version', apiVersionController.getVersion);

    router.post('/api/upload', middlewares.uploadSpeedLimiter, (req, res, next) => {
        middlewares.uploadMulter.single('file')(req, res, (err) => {
            if (err) {
                // Handle multer error if any
                return res.status(400).json({ error: 'File did not follow upload rules : ' + err });
            }
            // Call the next middleware
            next();
        });
    }, (req, res) => {
        apiUploadController.handleFileUpload(req, res, io, client, config.DB_NAME, config.COLLECTION_NAME);
    });

    router.get('/api/image/:filename', (req, res) => {
        imageController.showImageRaw(req, res, client, config.DB_NAME, config.COLLECTION_NAME);
    });

    // error page route (redirecting to a random endpoint like /asjdfhg or /error [which doesnt exist] will redirect to notFound page)
    router.get("/*", errorController.renderErrorPage);

    return router;
};