import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { RoutePaths } from 'src/routes/routes-constants';
import { clearAllItem, getItem } from 'src/utils/storage-utils';
import { EAuthToken } from 'src/variables/storage';

interface IProps {
  children?: React.ReactNode;
}

const NonAuthLayout = ({ children }: IProps) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const accessToken = getItem(EAuthToken.ACCESS_TOKEN);
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    if (pathname.includes(RoutePaths.VERIFY_PROFILE('')) || pathname.includes(RoutePaths.REGISTER_PROFILE(''))) {
      if (accessToken) {
        clearAllItem();
      }
      navigate(pathname + search);
      return;
    }

    if (pathname.includes(RoutePaths.RESET_PASSWORD) && accessToken) {
      clearAllItem();
      navigate(RoutePaths.RESET_PASSWORD + search);
    }
  }, []);

  if (
    isAuthenticated &&
    !location.pathname.includes(RoutePaths.PRIVACY) &&
    !location.pathname.includes(RoutePaths.TERM)
  )
    return <Navigate to={RoutePaths.HOME} />;

  return (
    <>
      {children} <Outlet />
    </>
  );
};

export default NonAuthLayout;
