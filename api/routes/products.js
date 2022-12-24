const express = require('express');
const router = express.Router();

/**
 * Import methods from Controller
 */
const {
    getAllProducts,
} = require('../controllers/products');

router.get('/', getAllProducts);

module.exports = router;