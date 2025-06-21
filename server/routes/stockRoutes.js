const express = require('express');
const router = express.Router();
const { getStockQuote, getStockHistory, getMarketStocks } = require('../controllers/stockController');
const auth = require('../middleware/authJWT')

//stock data api
router.get('/quote/:symbol', getStockQuote);        // e.g., /api/stock/quote/AAPL
router.get('/history/:symbol', getStockHistory);    // e.g., /api/stock/history/AAPL?range=1month
router.get('/market', auth, getMarketStocks);


//stock preferences saves
const stockController = require('../controllers/stockController');

router.post('/save', auth, stockController.saveStock);
router.get('/my', auth, stockController.getUserStocks);
router.delete('/:id', auth, stockController.deleteStock);

module.exports = router;
