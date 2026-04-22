import { AppRoute } from '@/const';
import { useAppSelector, useAppDispatch } from '@/hooks/store-hooks';
import { appActions } from '@/store/app/app-slice';
import { selectIsAuthorized, selectUserInfo } from '@/store/slices/user-slice';
import { logout } from '@/store/thunk/user-auth';
import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

interface NavProps {
  favouriteCount: number;
  isPageLogin?: boolean;
}

function Nav({ favouriteCount, isPageLogin }: NavProps): JSX.Element | null {
  const isAuth = useAppSelector(selectIsAuthorized);
  const data = useAppSelector(selectUserInfo);
  const email = data?.email;
  const avatarUrl = data?.avatarUrl;

  const dispatch = useAppDispatch();

  const handleLogOut = useCallback(
    (evt: React.MouseEvent) => {
      evt.preventDefault();
      dispatch(logout());
      dispatch(appActions.setRandomCity());
    },
    [dispatch],
  );

  const handleClick = useCallback(() => {
    dispatch(appActions.setRandomCity());
  }, [dispatch]);

  if (isPageLogin) {
    return null;
  }

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {isAuth ? (
          <>
            <li className="header__nav-item user">
              <Link
                className="header__nav-link header__nav-link--profile"
                to={AppRoute.Favorites}
              >
                <div
                  className="header__avatar-wrapper user__avatar-wrapper"
                  style={{
                    backgroundImage: `url(${avatarUrl})`,
                  }}
                ></div>
                <span className="header__user-name user__name">{email}</span>
                <span className="header__favorite-count">{favouriteCount}</span>
              </Link>
            </li>
            <li className="header__nav-item">
              <button
                className="header__nav-link header__nav-link--profile"
                onClick={handleLogOut}
              >
                <span className="header__signout">Sign out</span>
              </button>
            </li>
          </>
        ) : (
          <li className="header__nav-item user">
            <Link
              className="header__nav-link header__nav-link--profile"
              to={AppRoute.Login}
              onClick={handleClick}
            >
              <span className="header__login">Sign in</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

const MemoizedNav = memo(Nav);
export default MemoizedNav;
