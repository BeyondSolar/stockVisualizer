const Transaction = require('../models/Transactions');
const User = require('../models/User');

exports.resetWallet = async (req, res) => {
  const userId = req.user.id;
  try {
    await Transaction.deleteMany({ userId });
    const user = await User.findById(userId);
    user.wallet = 100000;
    await user.save();

    res.json({ message: 'Wallet reset successfully', wallet: user.wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting wallet' });
  }
};
