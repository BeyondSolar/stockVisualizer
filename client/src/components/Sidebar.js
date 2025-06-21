import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  UserIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Market', path: '/market', icon: <ChartBarIcon className="w-6 h-6" /> },
    { name: 'Portfolio', path: '/portfolio', icon: <CurrencyDollarIcon className="w-6 h-6" /> },
    { name: 'Profile', path: '/profile', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md">
      <div className="px-6 py-8">
        <nav className="space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
