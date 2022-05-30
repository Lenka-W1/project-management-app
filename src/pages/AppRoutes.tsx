import { Route, Routes } from 'react-router-dom';
import MainPage from './Main/MainPage';
import WelcomePage from './Welcome/WelcomePage';
import SignInPage from './SignIn/SignInPage';
import SignUpPage from './SignUp/SignUpPage';
import BoardPage from './Board/BoardPage';
import Error404 from './Error404/Error404';
import EditProfile from './EditProfile/EditProfile';
import { useSelector } from 'react-redux';
import { AppStateType } from '../BLL/store';
import ProtectedRoute from './ProtectedRoute';

export const PATH = {
  WELCOME: '/',
  EDIT_PROFILE: '/edit-profile',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  MAIN: '/main',
  BOARD: '/board/:id',
  ERROR: '/404',
};

function AppRoutes() {
  const isLoggedIn = useSelector<AppStateType, boolean>((state) => state.auth.isLoggedIn);
  return (
    <Routes>
      <Route path={PATH.WELCOME} element={<WelcomePage />} />
      <Route path={PATH.SIGN_IN} element={<SignInPage />} />
      <Route path={PATH.SIGN_UP} element={<SignUpPage />} />
      <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
        <Route path={PATH.EDIT_PROFILE} element={<EditProfile />} />
        <Route path={PATH.MAIN} element={<MainPage />} />
        <Route path={PATH.BOARD} element={<BoardPage />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default AppRoutes;
