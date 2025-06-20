import React, { useEffect, useState } from 'react';
import { getSavedStocks, deleteStock } from '../utils/api';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [stocks, setStocks] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await getSavedStocks(token);
        setStocks(res.data);
      } catch (err) {
        console.error('Failed to fetch saved stocks:', err);
      }
    };

    fetchStocks();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteStock(id, token);
      setStocks(stocks.filter((stock) => stock._id !== id));
      alert('Stock deleted!');
    } catch (err) {
      console.error('Failed to delete stock:', err);
    }
  };

  const handleStockClick = (symbol) => {
    // Navigate to Hero page ("/") and pass the symbol in state
    navigate('/', { state: { symbol } });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">User Profile</h1>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Saved Stocks</h2>
        {stocks.length === 0 ? (
          <p className="text-gray-600">No stocks saved yet.</p>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock._id}
              className="flex justify-between items-center border-b py-2"
            >
              {/* Make symbol clickable */}
              <button
                onClick={() => handleStockClick(stock.symbol)}
                className="font-mono text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                {stock.symbol}
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(stock._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block text-blue-600 hover:underline font-medium"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
};

export default UserProfile;
