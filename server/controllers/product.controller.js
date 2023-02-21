const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const Category = mongoose.model('Category');

module.exports.getProducts = (req, res, next) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = {category: req.query.categories.split(',')}
        }
        Product.find(filter).then(products => {
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
};

module.exports.getProduct = (req, res, next) => {
    try {
        Product.findById(req.params.id).populate('category').then((product) => {
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found!'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'Product fetched succussfully!',
                product: product
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.postProduct = async (req, res, next) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Invalid category'
            })
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            currency: req.body.currency,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        });

        product.save().then((savedProduct) => {
            if (!savedProduct) {
                return res.status(503).send({
                    success: false,
                    message: 'Product can not be updated! Please try again.'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'Product added succussfully!',
                product: savedProduct
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
}

module.exports.updateProduct = async (req, res, next) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Invalid category'
            })
        }
        Product.findByIdAndUpdate(req.params.id).then((founededProduct) => {
            if (!founededProduct) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found!'
                });
            } else {
                founededProduct.isFeatured = req.body.isFeatured;
                if (req.body.name) {
                    founededProduct.name = req.body.name;
                }
                if (req.body.description) {
                    founededProduct.description = req.body.description;
                }
                if (req.body.richDescription) {
                    founededProduct.richDescription = req.body.richDescription;
                }
                if (req.body.image) {
                    founededProduct.image = req.body.image;
                }
                if (req.body.images) {
                    founededProduct.images = req.body.images;
                }
                if (req.body.brand) {
                    founededProduct.brand = req.body.brand;
                }
                if (req.body.price) {
                    founededProduct.price = req.body.price;
                }
                if (req.body.currency) {
                    founededProduct.currency = req.body.currency;
                }
                if (req.body.category) {
                    founededProduct.category = req.body.category;
                }
                if (req.body.countInStock) {
                    founededProduct.countInStock = req.body.countInStock;
                }
                if (req.body.rating) {
                    founededProduct.rating = req.body.rating;
                }
                if (req.body.dateCreated) {
                    founededProduct.dateCreated = req.body.dateCreated;
                }
            };

            founededProduct.save().then((savedProduct) => {
                if (!savedProduct) {
                    return res.status(503).send({
                        success: false,
                        message: 'Product can not be updated! Please try again.'
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: 'Product updated succussfully!',
                    product: savedProduct
                });
            }).catch(err => {
                return next(err);
            })
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.deleteProduct = (req, res, next) => {
    try {
        Product.findByIdAndRemove(req.params.id).then((product) => {
            if (!product) {
                return res.status(404).send({
                    success: false,
                    message: 'Product not found!'
                });
            }
            return res.status(201).send({
                success: true,
                message: 'Product deleted succussfully!'
            });
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getProductsCount = (req, res, next) => {
    try {
        Product.countDocuments().then(productsCount => {
            if (!productsCount || productsCount.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Products found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    productsCount: productsCount
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};

module.exports.getFeaturedProducts = (req, res, next) => {
    try {
        const sort = req.params.sort ? +req.params.sort : -1;
        const count = req.params.count ? +req.params.count : 10;
        Product.find({
            isFeatured: true
        }).sort({
            _id: sort
        }).limit(count).then(featuredProducts => {
            if (!featuredProducts || featuredProducts.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'No Featured Products found.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    featuredProducts: featuredProducts
                });
            }
        }).catch(err => {
            return next(err);
        })
    } catch (err) {
        return next(err);
    }
};