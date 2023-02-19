const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required']
    },
    color: {
        type: String,
        required: [true, 'Category color is required']
    },
    icon: {
        type: Number,
        required: [true, 'Category icon is required']
    },
}, {
    timestamps: true
});

mongoose.model('Category', categorySchema);