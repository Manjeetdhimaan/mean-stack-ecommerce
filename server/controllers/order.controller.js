const mongoose = require('mongoose');

const Order = mongoose.model('Order');
const OrderItem = mongoose.model('OrderItem');

module.exports.getOrders = (req, res, next) => {
    try {
        Order.find().populate('user', 'name email').sort({
            'dateOrdered': -1
        }).then(orders => {
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

module.exports.getOrder = (req, res, next) => {
    try {
        Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate({
            path: 'orderItems', populate: { 
            path: 'product', populate: 'category'
          }
        })
        .then(order => {
            if (!order || order.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No order found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    order: order
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}

module.exports.postOrder = async (req, res, next) => {
    try {
        const orderItemIds = Promise.all(req.body.orderItems.map(orderItem => {
            let newOrderItem = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity
            });
            // newOrderItem = await newOrderItem.save();
            // return newOrderItem._id
            return newOrderItem.save().then(saveOrderItem => {
                if (!saveOrderItem) {
                    return res.status(503).send({
                        success: false,
                        message: 'Order Items can\'t be saved! Please try again.'
                    });
                }
                return saveOrderItem._id;
            }).catch(err => {
                return next(err);
            });

        }));

        const orderItemIdsResolved = await orderItemIds;

        const order = new Order({
            orderItems: orderItemIdsResolved,
            address: {
                shippingAddress1: req.body.shippingAddress1,
                shippingAddress2: req.body.shippingAddress2,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
                phone: req.body.phone
            },
            status: req.body.status,
            totolPrice: req.body.totolPrice,
            user: req.body.user
        });

        order.save().then((savedOrder) => {
            if (!savedOrder) {
                return res.status(503).send({
                    success: false,
                    message: 'Order can not be placed! Please try again.'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'Order placed succussfully!',
                order: savedOrder
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};



// order example 

// {
//     "orderItems": [
//         {
//             "quantity": 3,
//             "productId": "63f21a57de1e5160ff23a9cc"
//         },
//         {
//             "quantity": 2,
//             "product": "63f21ba24bd1593b2ca48add"
//         }
//     ],
//     "shippingAddress1": "Address 1",
//     "shippingAddress2": "Address 2",
//     "city": "Mohali",
//     "zip": "123456",
//     "country": "India",
//     "phone": "9898989898"
//     "user": "63f24bde043f5acaf6b8bb27"
// }