import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import Market from './components/Market';
import Profile from './components/Profile';
import Transactions from './components/Transactions';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market" element={<Market />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
