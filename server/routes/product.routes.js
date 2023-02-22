const express = require('express');
const router = express.Router();

const ctrlProduct = require('../controllers/product.controller');
const jwtHelper = require('../middlewares/jwtHelper');
const extractFile = require("../middlewares/file");


router.get('/get-products', ctrlProduct.getProducts);
router.get('/get-products-count', ctrlProduct.getProductsCount);
router.get('/get-featured-products/:count/:sort', ctrlProduct.getFeaturedProducts);
router.get('/get-product/:id', ctrlProduct.getProduct);
router.post('/post-product', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, extractFile, ctrlProduct.postProduct);
router.put('/update-product/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlProduct.updateProduct);
router.delete('/delete-product/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlProduct.deleteProduct);

module.exports = router;