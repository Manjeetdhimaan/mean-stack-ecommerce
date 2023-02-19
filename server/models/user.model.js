const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        required: [true, 'User email is required']
    },
    passwordHash: {
        type: Number,
        required: [true, 'User password is required']
    },
}, {
    timestamps: true
});

mongoose.model('User', userSchema);