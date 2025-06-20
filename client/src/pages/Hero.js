import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import StockSearch from '../components/stockSearch';
import StockChart from '../components/StockChart';
import StockInfoCard from '../components/StockInfoCard';
import { getQuote, getHistory } from '../utils/api';
import { useAuth } from '../context/authContext';

const Hero = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async (symbol) => {
    try {
      const [quoteRes, historyRes] = await Promise.all([
        getQuote(symbol),
        getHistory(symbol),
      ]);

      const formattedChartData = Object.entries(historyRes.data)
        .map(([date, values]) => ({
          date,
          close: parseFloat(values.close),
        }))
        .reverse();

      setQuoteData(quoteRes.data);
      setChartData(formattedChartData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setQuoteData(null);
      setChartData([]);
    }
  };

  // New: When Hero loads, if a symbol is passed in location.state, fetch it automatically
  useEffect(() => {
    if (location.state?.symbol) {
      handleSearch(location.state.symbol);
      // Optional: Clear the location state so refreshing doesn't repeat fetch
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate,location.pathname]);

  return (
    <div className="main-container p-4 mx-auto">
      {/* Header Navbar */}
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          📈 Stock Visualizer
        </h1>
        <nav className="flex items-center space-x-4">
          <Link
            to="/profile"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="border-b mb-4 border-gray-400"></div>

      <StockSearch onSearch={handleSearch} />

      {quoteData && <StockInfoCard quote={quoteData} />}
      {chartData.length > 0 && <StockChart data={chartData} />}
    </div>
  );
};

export default Hero;
