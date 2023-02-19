const express = require('express');
const router = express.Router();

const ctrlCategory = require('../controllers/category.controller');

router.get('/get-categories', ctrlCategory.getCategories);

module.exports = router;