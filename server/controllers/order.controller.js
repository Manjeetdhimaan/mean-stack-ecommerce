const mongoose = require('mongoose');

const Order = mongoose.model('Order');

module.exports.getOrders = (req, res, next) => {
    try {
        Order.find().then(orders => {
            if (!orders || orders.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    orders: orders
                });
            }
        }).catch(err => {
            console.log(err)
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}