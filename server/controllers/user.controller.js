const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports.getUsers = (req, res, next) => {
    try {
        User.find().then(users => {
            if (!users || users.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No users found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    users: users
                });
            }
        }).catch(err => {
            console.log(err);
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}