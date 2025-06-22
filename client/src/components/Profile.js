import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { getSavedStocks } from '../utils/stockService';
import { getWallet, resetWallet } from '../utils/userService'; // ✅ Use both services
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [savedStocks, setSavedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedRes = await getSavedStocks(token);
        setSavedStocks(savedRes.data);

        const walletRes = await getWallet(token); // ✅ Using the service
        setWallet(walletRes.data.wallet);
      } catch (err) {
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleResetWallet = async () => {
    try {
      const res = await resetWallet(token); // ✅ Already using service
      setWallet(res.data.wallet);
      alert('Wallet reset successful');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset wallet');
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 text-white">
      {/* Saved Stocks Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">📌 Saved Stocks</h2>
        <ul className="space-y-2">
          {savedStocks.length === 0 ? (
            <p>No saved stocks</p>
          ) : (
            savedStocks.map((stock) => (
              <li
                key={stock._id}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-3 rounded transition"
                onClick={() => navigate('/market', { state: { symbol: stock.symbol } })}
              >
                {stock.symbol}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Wallet Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">💰 Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ₹{wallet?.toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleResetWallet}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
        >
          Reset Wallet
        </button>
      </div>
    </div>
  );
};

export default Profile;
