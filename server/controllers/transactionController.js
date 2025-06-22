const Transaction = require('../models/Transactions');
const User = require('../models/User');
const stockController = require('../controllers/stockController')

//buy stock
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const pricePerUnit = await stockController.getCurrentPrice(symbol)
    const totalCost = quantity * pricePerUnit;

    if (user.wallet < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds!' });
    }

    user.wallet -= totalCost;
    await user.save(); // ✅ save the modified user document

    await Transaction.create({
      userId,
      symbol,
      quantity,
      pricePerUnit,
      type: 'buy',
      timestamp: new Date() 
    });

    res.status(201).json({ message: 'Stock bought successfully', wallet: user.wallet });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


//sell stock
exports.sellStock = async(req, res)=>{
    const { symbol, quantity} = req.body;
    const userId = req.user.id;

    const transactions = await Transaction.find({userId, symbol});

    const buyQty = transactions
                    .filter(tx => tx.type==='buy')
                    .reduce((sum, tx)=>sum + tx.quantity, 0);
    const sellQty = transactions
                    .filter(tx => tx.type==='sell')
                    .reduce((sum, tx) => sum+tx.quantity, 0);
        
    if(quantity > buyQty-sellQty) return res.status(400).json({message: 'Not enough stocks to sell!'});

    const pricePerUnit = await stockController.getCurrentPrice(symbol)
    const user = await User.findById(userId);
    const earnings = quantity*pricePerUnit;
    user.wallet += earnings;
    await user.save();

    await Transaction.create({ userId, symbol, quantity, pricePerUnit, type: 'sell'});

    res.json({message: 'Stock sold succesfully', wallet: user.wallet});
};


//get P/L
exports.getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });

    const portfolio = {};
    let totalInvested = 0;
    let totalRealized = 0;
    let holdingValue = 0;

    // Aggregate transactions per symbol
    for (let tx of transactions) {
      const { symbol, quantity, pricePerUnit, type } = tx;

      if (!portfolio[symbol]) {
        portfolio[symbol] = {
          totalBuyQty: 0,
          totalBuyValue: 0,
          totalSellQty: 0,
          realized: 0,
        };
      }

      const entry = portfolio[symbol];

      if (type === 'buy') {
        entry.totalBuyQty += quantity;
        entry.totalBuyValue += quantity * pricePerUnit;
      } else if (type === 'sell') {
        entry.totalSellQty += quantity;
        entry.realized += quantity * pricePerUnit;

        // Adjust invested based on FIFO approximation
        entry.totalBuyValue -= quantity * (entry.totalBuyValue / (entry.totalBuyQty + quantity));
      }
    }

    const breakdown = [];
    let index = 1;

    for (let symbol in portfolio) {
      const { totalBuyQty, totalBuyValue, totalSellQty, realized } = portfolio[symbol];
      const quantity = totalBuyQty - totalSellQty;

      if (quantity <= 0) continue;

      const avgBuyPrice = totalBuyValue / totalBuyQty;
      const currentPrice = await stockController.getCurrentPrice(symbol);
      const currentVal = quantity * currentPrice;
      const totalPurchasePrice = avgBuyPrice * quantity;
      const gainLoss = currentVal - totalPurchasePrice;

      totalInvested += totalPurchasePrice;
      totalRealized += realized;
      holdingValue += currentVal;

      breakdown.push({
        '#': index++,
        symbol,
        currentPrice: currentPrice.toFixed(2),
        quantity,
        totalPurchasePrice: totalPurchasePrice.toFixed(2),
        totalCashValue: currentVal.toFixed(2),
        totalGainLoss: gainLoss.toFixed(2),
      });
    }

    const totalPL = holdingValue - totalInvested;

    res.status(200).json({
      summary: {
        invested: totalInvested.toFixed(2),
        realized: totalRealized.toFixed(2),
        currentValue: holdingValue.toFixed(2),
        profitLoss: totalPL.toFixed(2),
        profitLossPercent: totalInvested > 0
          ? ((totalPL / totalInvested) * 100).toFixed(2)
          : '0.00'
      },
      breakdown
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to compute portfolio data' });
  }
};


// GET: /api/transact/getTransactions
exports.getTransactionsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    let { startDate, endDate } = req.query;

    const now = new Date();

    if (!startDate || !endDate) {
      // Default: last 10 days
      endDate = now;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 10);
    } else {
      // Convert to Date objects if provided
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    const transactions = await Transaction.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (err) {
    console.error('Date filter error:', err.message);
    res.status(500).json({ message: 'Failed to fetch filtered transactions' });
  }
};

