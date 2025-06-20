import React from 'react';
import { saveStock } from '../utils/api';

const StockInfoCard = ({ quote }) => {
    const token = localStorage.getItem('token');

    const handleSave = async () => {
        try {
            await saveStock(quote.symbol, token);
            alert('Stock saved!');
        } catch (err) {
            if (err.response?.data?.msg === 'Stock already saved') {
                alert('Stock already saved!');
            } else {
                console.error('Error saving stock:', err);
            }
        }
    };

    return (
        <div className="border p-4 rounded bg-white shadow">
            <h2 className="text-xl font-bold mb-2">{quote.symbol}</h2>
            <p>Date: {new Date(quote.date).toLocaleDateString()}</p>
            <p>Open: ${quote.open}</p>
            <p>High: ${quote.high}</p>
            <p>Low: ${quote.low}</p>
            <p>Close: ${quote.close}</p>
            <p>Volume: {quote.volume.toLocaleString()}</p>
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
            >
                Save
            </button>
        </div>
    );
};

export default StockInfoCard;
