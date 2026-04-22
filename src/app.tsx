import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MemoizedProtectedRoute from './components/private-route';
import { AppRoute, DEFAULT_CITY } from './const';
import { useAppDispatch, useAppSelector } from './hooks/store-hooks';
import MemoizedFavouritePage from './pages/favourites-page/favourites-page';
import MemoizedLoginPage from './pages/login-page/login-page';
import MemoizedMainPage from './pages/main-page/main-page';
import MemoizedNotFoundPage from './pages/not-found-page/not-found-page';
import MemoizedOfferPage from './pages/offer-page/offer-page';
import { fetchFavorites } from './store/thunk/favorite';
import { fetchAllOffers } from './store/thunk/offers';
import { checkAuth } from './store/thunk/user-auth';
import { selectIsAuthorized } from './store/user-slice/user-slice';

export default function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthorized);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchAllOffers());
  }, [dispatch]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoute.Root}
          element={
            <Navigate
              to={`${AppRoute.Root}${DEFAULT_CITY.toLowerCase()}`}
              replace
            />
          }
        />
        <Route path={`${AppRoute.Root}:city`} element={<MemoizedMainPage />} />
        <Route
          path={AppRoute.Login}
          element={
            <MemoizedProtectedRoute onlyUnauth>
              <MemoizedLoginPage />
            </MemoizedProtectedRoute>
          }
        />
        <Route
          path={AppRoute.Favorites}
          element={
            <MemoizedProtectedRoute>
              <MemoizedFavouritePage />
            </MemoizedProtectedRoute>
          }
        />
        <Route path={`${AppRoute.Offer}/:id`} element={<MemoizedOfferPage />} />
        <Route path={AppRoute.NotFound} element={<MemoizedNotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
