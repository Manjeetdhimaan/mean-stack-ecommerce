const express = require('express');
const router = express.Router();

const ctrlOrder = require('../controllers/order.controller');

router.get('/get-orders', ctrlOrder.getOrders);

module.exports = router;