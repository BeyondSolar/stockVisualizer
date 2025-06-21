import React, { useState } from 'react';
import { getQuote, getHistory, getStockHolding  } from '../utils/stockService';
import { buyStock, sellStock, } from '../utils/transactionService';
import { useAuth } from '../context/authContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const Market = () => {
  const [symbol, setSymbol] = useState('');
  const [quoteData, setQuoteData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [holdingQty, setHoldingQty] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { token } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setQuoteData(null);
    setChartData([]);
    setHoldingQty(0);

    try {
      const [quoteRes, historyRes, holdingRes] = await Promise.all([
        getQuote(symbol),
        getHistory(symbol),
        getStockHolding(symbol, token),
      ]);

      setQuoteData(quoteRes.data);

      const formattedChart = Object.entries(historyRes.data)
        .map(([date, values]) => ({
          date,
          close: parseFloat(values.close),
        }))
        .reverse();

      setChartData(formattedChart);
      setHoldingQty(holdingRes.data.quantity);
    } catch (err) {
      console.error(err);
      setError('Stock not found or API error');
    }
  };

  const handleBuy = async () => {
    try {
      await buyStock({ symbol, quantity }, token);
      alert('Stock bought!');
      setHoldingQty(prev => prev + quantity);
    } catch (err) {
      alert(err.response?.data?.message || 'Buy failed');
    }
  };

  const handleSell = async () => {
    try {
      await sellStock({ symbol, quantity }, token);
      alert('Stock sold!');
      setHoldingQty(prev => prev - quantity);
    } catch (err) {
      alert(err.response?.data?.message || 'Sell failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol"
          className="flex-grow p-3 rounded-l bg-gray-100 text-black"
        />
        <button className="bg-blue-600 px-6 py-3 rounded-r hover:bg-blue-700 text-white font-semibold">
          Search
        </button>
      </form>

      {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

      {quoteData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-gray-900 dark:text-white mb-6">
          <h2 className="text-2xl font-bold mb-2">{quoteData.symbol}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p><strong>Open:</strong> ₹{quoteData.open}</p>
            <p><strong>High:</strong> ₹{quoteData.high}</p>
            <p><strong>Low:</strong> ₹{quoteData.low}</p>
            <p><strong>Close:</strong> ₹{quoteData.close}</p>
            <p><strong>Volume:</strong> {quoteData.volume}</p>
            <p><strong>Date:</strong> {new Date(quoteData.date).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg font-semibold">💼 You own: <span className="text-blue-500">{holdingQty} shares</span></p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="p-2 rounded bg-gray-100 text-black w-32"
            />
            <div className="flex gap-4">
              <button
                onClick={handleBuy}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
              >
                Buy
              </button>
              <button
                onClick={handleSell}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Closing Price Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Market;
