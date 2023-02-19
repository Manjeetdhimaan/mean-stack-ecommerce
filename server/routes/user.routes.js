const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

router.get('/get-users', ctrlUser.getUsers);

module.exports = router;