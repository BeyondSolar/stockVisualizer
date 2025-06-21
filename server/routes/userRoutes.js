const express = require('express');
const router = express.Router();
const {resetWallet} = require('../controllers/userController')
const auth = require('../middleware/authJWT');

router.post('/reset-wallet', auth, resetWallet);

module.exports = router;