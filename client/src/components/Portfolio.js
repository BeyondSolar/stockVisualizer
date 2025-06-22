import React, { useEffect, useState } from 'react';
import { getSavedStocks } from '../utils/stockService';
import { getPortfolioSummary } from '../utils/transactionService';
import { useAuth } from '../context/authContext';

const Portfolio = () => {
  const { token } = useAuth();
  const [saved, setSaved] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const [savedRes, summaryRes] = await Promise.all([
          getSavedStocks(token),
          getPortfolioSummary(token),
        ]);

        setSaved(savedRes.data || []);
        setBreakdown(summaryRes.data?.breakdown || []);
        setSummary(summaryRes.data?.summary || null);
      } catch (err) {
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  if (loading) return <div className="text-white text-center mt-10">Loading Portfolio...</div>;

  return (
    <div className="space-y-8">
      
      {/* Section 1: Investment Breakdown */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-white">💼 Investment Breakdown</h2>

        {breakdown.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
            You don't hold any stocks currently.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Buy Value (₹)</th>
                  <th className="px-4 py-2">Current Value (₹)</th>
                  <th className="px-4 py-2">Gain/Loss (₹)</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((item) => (
                  <tr key={item.symbol} className="border-t border-gray-300 dark:border-gray-600">
                    <td className="px-4 py-2">{item['#']}</td>
                    <td className="px-4 py-2 font-medium">{item.symbol}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">₹{item.totalPurchasePrice}</td>
                    <td className="px-4 py-2">₹{item.totalCashValue}</td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        parseFloat(item.totalGainLoss) >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {parseFloat(item.totalGainLoss) >= 0 ? '▲' : '▼'} ₹{item.totalGainLoss}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
