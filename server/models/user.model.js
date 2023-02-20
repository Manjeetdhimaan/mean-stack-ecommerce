const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const devEnv = require('../dev-env/dev-env');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email is required']
    },
    passwordHash: {
        type: String,
        required: [true, 'User password is required']
    },
    phone: {
        type: String,
        required: [true, 'User phone is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    address: {
        type: Object,
        street: {
            type: String
        },
        apartment: {
            type: String
        },
        city: {
            type: String,
        },
        zip: {
            type: String
        },
        country: {
            type: String
        }
    },
    saltSecret: String
}, {
    timestamps: true
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Methods
userSchema.statics.hashPassword = function hashPassword(password) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
        });
    });
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJwt = function (remeberMe) {
    return jwt.sign({
            _id: this._id,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET, {
            expiresIn: remeberMe ? '365d' : process.env.JWT_EXP
        });
}

mongoose.model('User', userSchema);