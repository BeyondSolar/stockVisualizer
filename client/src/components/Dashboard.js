import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { getSavedStocks, getMarketStocks } from '../utils/stockService';
import { getPortfolioSummary } from '../utils/transactionService';

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const [market, setMarket] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [savedRes, marketRes, summaryRes] = await Promise.all([
          getSavedStocks(token),
          getMarketStocks(token),
          getPortfolioSummary(token),
        ]);

        setSaved(savedRes.data);
        setMarket(marketRes.data);
        setSummary(summaryRes.data?.summary || null);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      {/* Saved Stocks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">📌 Saved Stocks</h2>

        {saved.length === 0 ? (
          <div className="bg-blue-100 text-blue-800 p-4 rounded">
            💡 You haven’t saved any stocks yet. Visit the <strong>Market</strong> page to save your favorites.
          </div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {saved.map((stock) => (
              <li
                key={stock._id}
                onClick={() => navigate('/market', { state: { symbol: stock.symbol } })}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {stock.symbol}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Market Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">📊 Market Overview</h2>

        {market.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
            ⚠️ No market data available right now. Try saving some stocks or check back later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {market.map((item) => (
              <div
                key={item.symbol}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center"
              >
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.symbol}</h3>
                <p className="text-green-600 font-semibold">₹{item.price}</p>
                <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Portfolio Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">📈 Portfolio Summary</h2>

        {!summary ? (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded">
            ⚠️ Unable to fetch portfolio summary. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Invested:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">₹{summary.invested}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Realized:</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">₹{summary.realized}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Current Value:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">₹{summary.currentValue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total P/L:</span>
                <span
                  className={`font-bold ${
                    parseFloat(summary.profitLoss) >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {parseFloat(summary.profitLoss) >= 0 ? '▲' : '▼'} ₹{summary.profitLoss}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">P/L %:</span>
                <span
                  className={`font-bold ${
                    parseFloat(summary.profitLossPercent) >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {summary.profitLossPercent}%
                </span>
              </div>
            </div>

            {/* Summary Badge */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded shadow p-6 text-center">
              <div
                className={`text-4xl font-extrabold ${
                  parseFloat(summary.profitLoss) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {parseFloat(summary.profitLoss) >= 0 ? '📈 Profit' : '📉 Loss'}
              </div>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                You're currently {parseFloat(summary.profitLossPercent) >= 0 ? 'up' : 'down'} by
                <span className="font-bold px-1">
                  {Math.abs(summary.profitLossPercent)}%
                </span>
                on your total investment.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
