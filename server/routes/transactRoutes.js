const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController')
const auth = require('../middleware/authJWT')

router.post('/buy', auth, transactionController.buyStock);
router.post('/sell', auth, transactionController.sellStock);
router.get('/summary', auth, transactionController.getPortfolioSummary);

module.exports = router;
