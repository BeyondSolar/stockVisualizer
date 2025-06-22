const express = require('express');
const router = express.Router();
const {resetWallet, getWallet} = require('../controllers/userController')
const auth = require('../middleware/authJWT');

router.get('/me', auth, getWallet);
router.post('/reset-wallet', auth, resetWallet);

module.exports = router;