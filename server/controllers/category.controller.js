const mongoose = require('mongoose');

const Category = mongoose.model('Category');

module.exports.getCategories = (req, res, next) => {
    try {
        Category.find().then(categories => {
            if (!categories || categories.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No categories found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    categories: categories
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