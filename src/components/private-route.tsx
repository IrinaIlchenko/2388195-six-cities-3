import { AppRoute, DEFAULT_CITY } from '@/const';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectUserInfo } from '@/store/user-slice/user-slice';
import { memo, ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
  onlyUnauth?: boolean;
};

interface LocationState {
  from?: {
    pathname: string;
  };
}

function ProtectedRoute({ children, onlyUnauth }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAppSelector(selectUserInfo);

  if (onlyUnauth && user) {
    const from =
      (location.state as LocationState)?.from?.pathname ||
      `${AppRoute.Root}${DEFAULT_CITY.toLowerCase()}`;
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !user) {
    return <Navigate state={{ from: location }} to={AppRoute.Login} replace />;
  }

  return children;
}

const MemoizedProtectedRoute = memo(ProtectedRoute);
export default MemoizedProtectedRoute;
