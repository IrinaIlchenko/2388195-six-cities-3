import { createAPI } from '@/services/api';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { commentsSlice } from './comments/comments-slice';
import { favoriteSlice } from './favorite/favorite-slice';
import { offerSlice } from './slices/offer-slice';
import { offersSlice } from './slices/offers-slice';
import { userSlice } from './slices/user-slice';
import { appSlice } from './app/app-slice';

const reducer = combineReducers({
  [appSlice.name]: appSlice.reducer,
  [offersSlice.name]: offersSlice.reducer,
  [offerSlice.name]: offerSlice.reducer,
  [commentsSlice.name]: commentsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [favoriteSlice.name]: favoriteSlice.reducer,
});

export const api = createAPI();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});
