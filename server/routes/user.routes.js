const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const jwtHelper = require('../middlewares/jwtHelper');

router.get('/get-users', ctrlUser.getUsers);
router.get('/get-users-count', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlUser.getUserCount);
router.get('/get-user/:id', jwtHelper.verifyJwtToken, ctrlUser.getUser);
router.post('/post-user', ctrlUser.postUser);
router.post('/user-login', ctrlUser.authenticateUser);
router.put('/update-user/:id', ctrlUser.updateUser);
router.delete('/delete-user/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlUser.deleteUser);

module.exports = router;