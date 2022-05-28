import { Navigate, Outlet } from 'react-router-dom';
import { PATH } from './AppRoutes';

type ProtectedRoutePropsType = {
  isLoggedIn: boolean;
};
const ProtectedRoute = ({ isLoggedIn }: ProtectedRoutePropsType) => {
  if (!isLoggedIn) {
    return <Navigate to={PATH.WELCOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
