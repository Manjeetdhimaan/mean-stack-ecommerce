const express = require('express');
const router = express.Router();

const ctrlProduct = require('../controllers/product.controller');

router.get('/get-products', ctrlProduct.getProducts);
router.post('/post-product', ctrlProduct.postProduct);

module.exports = router;