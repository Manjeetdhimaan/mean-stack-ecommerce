const mongoose = require('mongoose');

const Product = mongoose.model('Product');

module.exports.getProducts = (req, res, next) => {
    try {
        Product.find().then(products => {
            if (!products || products.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Products found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    products: products
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

module.exports.postProduct = (req, res, next) => {
    try {
        const product = new Product({
            name: req.body.name,
            imageUrl: req.body.imageUrl
        });
       
        product.save().then(() => {
            return res.status(200).send({
                success: true,
                message: 'Product added succussfully!'
            });
        }).catch(err => {
                return next(err);
        })
    } catch (err) {
        return next(err);
    }
}