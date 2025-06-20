import React, { useState } from 'react';

const StockSearch = ({ onSearch }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.toUpperCase());
      setSymbol('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded">
        Search
      </button>
    </form>
  );
};

export default StockSearch;
