const express = require('express');
const router = express.Router();

const ctrlOrder = require('../controllers/order.controller');
const jwtHelper = require('../middlewares/jwtHelper');
// for admin
router.get('/get-orders', ctrlOrder.getOrders);
// for specific user
router.get('/get-user-orders', ctrlOrder.getUserOrders);
router.get('/get-order/:id', ctrlOrder.getOrder);
router.post('/post-order', ctrlOrder.postOrder);
router.put('/update-order-status/:id', ctrlOrder.updateOrderStatus);
router.delete('/delete-order/:id', ctrlOrder.deleteOrder);

module.exports = router;