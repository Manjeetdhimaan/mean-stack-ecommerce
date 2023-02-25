const express = require('express');
const router = express.Router();

const ctrlOrder = require('../controllers/order.controller');
const jwtHelper = require('../middlewares/jwtHelper');
// for admin
router.get('/get-orders', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlOrder.getOrders);
// for specific user
router.get('/get-user-orders', jwtHelper.verifyJwtToken, ctrlOrder.getUserOrders);
router.get('/get-order/:id', jwtHelper.verifyJwtToken, ctrlOrder.getOrder);
router.post('/post-order', jwtHelper.verifyJwtToken, ctrlOrder.postOrder);
router.put('/update-order-status/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlOrder.updateOrderStatus);
router.delete('/delete-order/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlOrder.deleteOrder);

module.exports = router;