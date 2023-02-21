const express = require('express');
const router = express.Router();

const ctrlOrder = require('../controllers/order.controller');
const jwtHelper = require('../middlewares/jwtHelper');

router.get('/get-orders', jwtHelper.verifyJwtToken, ctrlOrder.getOrders);
router.get('/get-order/:id', jwtHelper.verifyJwtToken, ctrlOrder.getOrder);
router.post('/post-order', jwtHelper.verifyJwtToken, ctrlOrder.postOrder);

module.exports = router;