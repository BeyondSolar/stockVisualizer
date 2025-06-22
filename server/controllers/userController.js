const Transaction = require('../models/Transactions');
const User = require('../models/User');

exports.getWallet = async(req, res) =>{
    const userId = req.user.id;
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).message({message: 'User not found'});

        res.json({wallet: user.wallet});
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting wallet' });
    }
}

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
