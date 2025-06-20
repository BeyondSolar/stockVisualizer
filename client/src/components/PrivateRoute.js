import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
