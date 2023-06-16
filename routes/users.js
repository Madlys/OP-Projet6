const express = require('express');
const router = express.Router();
console.log('route file loaded');
const userCtrl = require('../controllers/users');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;