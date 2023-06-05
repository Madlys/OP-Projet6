const express = require('express');
const router = express.Router();
const utilisateurCtrl = require('../controllers/utilisateurs');

router.post('/sinup', utilisateurCtrl.signup);
router.post('/login', utilisateurCtrl.login);


module.exports = router;