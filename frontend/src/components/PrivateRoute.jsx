
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ user, children }) => {
  let location = useLocation();

  return (
    user.login ? children : <Navigate to="/" state={{ from: location }} />
  );
}

export default PrivateRoute;

