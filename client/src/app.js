import { Routes, Route } from 'react-router-dom';
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './pages/UserProfile';

function App() {

  return (
    <div className="min-h-screen bg-orange-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />     
        <Route path="/profile" element={ <PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Hero /></PrivateRoute>} />
      </Routes>
    </div>
    
  );
}

export default App;
