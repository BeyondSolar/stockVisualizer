import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-300 dark:bg-gray-900 dark:border-gray-700">
      <div className=" mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo / Brand */}
        <div
          className="text-3xl font-extrabold text-white cursor-pointer tracking-tight"
          onClick={() => navigate('/')}
        >
          📈 Stock Visualizer
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-lg">

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 font-semibold shadow-sm"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
