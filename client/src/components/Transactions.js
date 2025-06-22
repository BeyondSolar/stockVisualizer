import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { getTransactionsByDate } from '../utils/transactionService';

const Transactions = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactionsByDate(token, startDate, endDate);
      setTransactions(res.data);
    } catch (err) {
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(); // Initial load (last 10 days)
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">📅 Filter Transactions by Date</h2>

      <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-4 items-center text-white">
        <label>
          Start Date:
          <input
            type="date"
            className="ml-2 px-2 py-1 rounded bg-gray-700 text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            className="ml-2 px-2 py-1 rounded bg-gray-700 text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Apply Filter
        </button>
      </form>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400">No transactions in this range.</p>
      ) : (
        <table className="w-full table-auto text-left text-white bg-gray-800 rounded shadow">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Symbol</th>
              <th className="p-3">Type</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={tx._id} className="border-t border-gray-600 hover:bg-gray-700">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{tx.symbol}</td>
                <td className={`p-3 font-bold ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type.toUpperCase()}
                </td>
                <td className="p-3">{tx.quantity}</td>
                <td className="p-3">₹{tx.pricePerUnit.toFixed(2)}</td>
                <td className="p-3">₹{(tx.quantity * tx.pricePerUnit).toFixed(2)}</td>
                <td className="p-3 text-sm">{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
