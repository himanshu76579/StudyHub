import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 1. Redux se sirf 'user' data nikalo (kyunki humne isAuthenticated banaya hi nahi tha)
  const authState = useSelector((state) => state.auth);
  const loginData = authState.user; // Backend se aaya hua poora data { token, user: {...} }

  // 2. Agar data nahi hai (yani banda logged in nahi hai), toh bahar nikalo
  if (!loginData) {
    return <Navigate to="/login" replace />;
  }

  // 3. Backend nested user bhej raha hai, toh actual user details nikalenge
  const actualUser = loginData.user ? loginData.user : loginData;

  // 4. Role ka check
  if (allowedRoles && !allowedRoles.includes(actualUser.role)) {
    if (actualUser.role === 'admin' || actualUser.role === 'superadmin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 5. Sab theek hai, toh jo page maanga tha wo dikhao!
  return children;
};

export default ProtectedRoute;