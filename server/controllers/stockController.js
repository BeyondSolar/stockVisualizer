const axios = require('axios');
const Stock = require('../models/Stock');

const TIINGO_API_KEY = process.env.TIINGO_API_KEY;

// Get current price
exports.getCurrentPrice = async (symbol) => {
  try {
    const res = await axios.get(`https://api.tiingo.com/tiingo/daily/${symbol}/prices`, {
      headers: {
        'Authorization': `Token ${process.env.TIINGO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return res.data[0]?.close || 0;
  } catch (err) {
    console.error(`Error fetching price for ${symbol}:`, err.message);
    return 0;
  }
};

// Get latest stock quote from Tiingo
exports.getStockQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${symbol}/prices`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.TIINGO_API_KEY}`
      }
    });

    const data = response.data;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No quote data found' });
    }

    const latest = data[data.length - 1];

    res.json({
      symbol,
      open: latest.open,
      high: latest.high,
      low: latest.low,
      close: latest.close,
      volume: latest.volume,
      date: latest.date,
    });
  } catch (error) {
    console.error('Error fetching stock quote from Tiingo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch stock quote' });
  }
};


// Get historical stock data from Tiingo
exports.getStockHistory = async (req, res) => {
  const { symbol } = req.params;
  const range = req.query.range || '1month';

  // Calculate startDate based on range (optional)
  const endDate = new Date();
  const startDate = new Date();

  switch (range) {
    case '1month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '3months':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case '6months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case '1year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(endDate.getMonth() - 1);
  }

  try {
    const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${symbol}/prices`, {
      params: {
        token: TIINGO_API_KEY,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      }
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No historical data found' });
    }

    // Format to similar structure as Alpha Vantage if you want, else send raw data
    const formattedData = {};
    response.data.forEach(day => {
      formattedData[day.date.split('T')[0]] = {
        open: day.open,
        high: day.high,
        low: day.low,
        close: day.close,
        volume: day.volume,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};

// display some stocks on the trade page
exports.getMarketStocks = async (req, res) => {
  const symbols = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];
  const stockData = [];

  try {
    for (let symbol of symbols) {
      await new Promise(resolve => setTimeout(resolve, 20)); // delay between requests

      const response = await axios.get(`https://api.tiingo.com/tiingo/daily/${symbol}/prices`, {
        headers: {
          Authorization: `Token ${process.env.TIINGO_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

      const data = response.data[0];
      stockData.push({
        symbol,
        name: symbol,
        price: data.close,
        date: data.date,
      });
    }

    res.json(stockData);
  } catch (err) {
    console.error('Error fetching market stocks:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};


// Save a stock for the authenticated user
exports.saveStock = async (req, res) => {
  const { symbol } = req.body;
  const userId = req.user.id;

  try {
    const existingStock = await Stock.findOne({ symbol, userId });
    if (existingStock) {
      return res.status(400).json({ msg: 'Stock already saved' });
    }

    const newStock = new Stock({ symbol, userId });
    await newStock.save();

    res.status(201).json({ msg: 'Stock saved', stock: newStock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get saved stocks of authenticated user
exports.getUserStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.user.id });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete saved stock by id for authenticated user
exports.deleteStock = async (req, res) => {
  try {
    await Stock.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Stock removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
