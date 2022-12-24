/**
 * Import ENV Variables
 */
require('dotenv').config({
    path: '.env',
});
const port = process.env.PORT || 4000;
const db_atlas_url = process.env.DB_ATLAS || '';


/**
 * Initialize application | Import methods and middlewares
 */
const express = require('express');
const app = express();
const connect = require('./config/database/connect');

require('express-async-errors');

/**
 * Import Routes
 */
const productsRouter = require('./api/routes/products');
app.use('/api/v1/products', productsRouter);


/**
 * Import Middlewares
 */
const errorHandler = require('./api/middlewares/errorHandler');
const notFound = require('./api/middlewares/notFound');
app.use(errorHandler);
app.use(notFound);

/**
 * Starting the application
 */
const start = async () => {
    try {
        /**
         * Connection to the db_atlas is success.
         */
        await connect(db_atlas_url);
        app.listen(port, console.log("Listening to port:", port));
    } catch(error) {
        /**
         * There has been an error connecting to the db_atlas.
         */
        console.error(error);
    }
}
start();