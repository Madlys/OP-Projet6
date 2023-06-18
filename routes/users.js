const express = require('express');
const router = express.Router();
console.log('route file loaded');
const userController = require('../controllers/users');


router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;