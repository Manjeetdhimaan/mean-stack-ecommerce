const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image is required']
    },
    countInStock: {
        type: Number,
        required: [true, 'Product stock quantity is required']
    },
}, {
    timestamps: true
});

mongoose.model('Order', orderSchema);