const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: [true, 'Order Item is required']
    }],
    address: {
        type: Object,
        shippingAddress1: {
            type: String,
            required: [true, 'Shipping address is required']
        },
        shippingAddress2: {
            type: String
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        zip: {
            type: String,
            required: [true, 'Zip code is required']
        },
        country: {
            type: String,
            required: [true, 'Shipping country is required']
        },
        phone: {
            type: String,
            required: [true, 'Contact number is required']
        }
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totolPrice: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Order', orderSchema);