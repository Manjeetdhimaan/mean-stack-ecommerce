const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

router.get('/get-users', ctrlUser.getUsers);
router.get('/get-user/:id', ctrlUser.getUser);
router.post('/post-user', ctrlUser.postUser);
router.put('/update-user/:id', ctrlUser.updateUser);

module.exports = router;