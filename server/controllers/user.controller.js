const mongoose = require('mongoose');

const User = mongoose.model('User');

const userExists = async (email) => {
    const user = await User.findOne({
        email: email.toLowerCase().trim()
    })
    if (user) {
        return true;
    } else {
        return false;
    }
}

module.exports.getUsers = (req, res, next) => {
    try {
        User.find().select('-passwordHash').then(users => {
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

module.exports.getUser = (req, res, next) => {
    try {
        User.findById(req.params.id).select('-passwordHash').then((user) => {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'User fetched succussfully!',
                user: user
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.postUser = async (req, res, next) => {
    try {
        let user = new User({
            name: req.body.name,
            passwordHash: User.hashPassword(req.body.password),
            email: req.body.email,
            phone: req.body.phone,
            address: {
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                zip: req.body.zip,
                country: req.body.country,
            }
        });

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(422).send({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (await userExists(req.body.email)) {
            return res.status(409).json({
                success: false,
                message: 'Account with this email address exists already! Please try with different one'
            })
        }
        user.save().then((saveUser) => {
            if(!saveUser) {
                return res.status(500).send({
                    success: false,
                    message: 'An error occured! Please try again.'
                })
            }
            return res.status(200).send({
                success: true,
                message: 'Account created succussfully!'
            });
        }).catch(err => {
            if (err.code == 11000)
                return res.status(409).send({
                    success: false,
                    message: 'Account with this email address exists already!'
                });
            else
                return next(err);
        })

    } catch (err) {
        return next(err);
    }
}

module.exports.updateUser = async (req, res, next) => {
    try {       
        User.findByIdAndUpdate(req.params.id).then((founededUser) => {
            if (!founededUser) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else {
                if (req.body.name) {
                    founededUser.name = req.body.name;
                }
                if (req.body.email) {
                    founededUser.email = req.body.email;
                }
                if (req.body.password) {
                    founededUser.passwordHash = User.hashPassword(req.body.password);
                }
                if (req.body.phone) {
                    founededUser.phone = req.body.phone;
                }
                if (req.body.street || req.body.apartment || req.body.city || req.body.zip || req.body.country) {
                    founededUser.address = {
                        street: req.body.street,
                        city: req.body.city,
                        apartment: req.body.apartment,
                        zip: req.body.zip,
                        country: req.body.country,
                    };
                }
            };

            founededUser.save().then((savedUser) => {
                if (!savedUser) {
                    return res.status(503).send({
                        success: false,
                        message: 'Details can not be updated! Please try again.'
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: 'Profile updated succussfully!',
                    user: savedUser
                });
            }).catch(err => {
                return next(err);
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};