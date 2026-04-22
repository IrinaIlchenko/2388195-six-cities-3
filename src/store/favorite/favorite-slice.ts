import { RequestStatus, FavoriteStatus } from '@/const';
import { FullOffer, FullOffers } from '@/types/offer';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { fetchFavorites, postFavorite } from '../thunk/favorite';
import { groupOffersByCity } from '@/util';

interface FavoriteState {
  favoriteOffer: FullOffer | null;
  favoriteOffers: FullOffers;
  favoriteOfferStatus: RequestStatus;
}

const initialState: FavoriteState = {
  favoriteOffer: null,
  favoriteOffers: [],
  favoriteOfferStatus: RequestStatus.Idle,
};

export const favoriteSlice = createSlice({
  name: 'favoriteOffers',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.favoriteOfferStatus = RequestStatus.Loading;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoriteOfferStatus = RequestStatus.Success;
        state.favoriteOffers = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.favoriteOfferStatus = RequestStatus.Failed;
      })
      .addCase(postFavorite.pending, (state) => {
        state.favoriteOfferStatus = RequestStatus.Loading;
      })
      .addCase(postFavorite.fulfilled, (state, action) => {
        state.favoriteOfferStatus = RequestStatus.Success;
        switch (action.payload.favoriteStatus) {
          case FavoriteStatus.Added:
            state.favoriteOffers.push(action.payload.offer);
            break;
          case FavoriteStatus.Removed:
            state.favoriteOffers = state.favoriteOffers.filter(
              (offer) => offer.id !== action.payload.offer.id,
            );
        }
      })
      .addCase(postFavorite.rejected, (state) => {
        state.favoriteOfferStatus = RequestStatus.Failed;
      }),
  selectors: {
    selectFavoriteOffers: (state: FavoriteState) => state.favoriteOffers,
    selectFavoriteOffersStatus: (state: FavoriteState) => state.favoriteOfferStatus,
  },
});

export const { selectFavoriteOffers, selectFavoriteOffersStatus } = favoriteSlice.selectors;

export const selectFavoriteCount = createSelector(
  [selectFavoriteOffers],
  (favoriteOffers) => favoriteOffers.length
);

export const selectGroupedFavoriteOffers = createSelector(
  [selectFavoriteOffers],
  (favoriteOffers) => groupOffersByCity(favoriteOffers)
);
