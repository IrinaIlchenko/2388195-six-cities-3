import { MAX_IMAGES_COUNT, MAX_NEARBY_COUNT, RequestStatus } from '@/const';
import { FullOffer, ListOffers } from '@/types/offer';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { postFavorite } from '../thunk/favorite';
import { fetchOffer, fetchNearby } from '../thunk/offer';

interface OfferState {
  offer: FullOffer | null;
  nearbyOffers: ListOffers;
  offerStatus: RequestStatus;
  offerStatusCode: number | undefined;
}

const initialState: OfferState = {
  offer: null,
  nearbyOffers: [],
  offerStatus: RequestStatus.Idle,
  offerStatusCode: undefined,
};

export const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    clear(state) {
      state.offer = null;
      state.nearbyOffers = [];
      state.offerStatus = RequestStatus.Idle;
      state.offerStatusCode = undefined;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchOffer.pending, (state) => {
        state.offerStatus = RequestStatus.Loading;
      })
      .addCase(fetchOffer.fulfilled, (state, action) => {
        state.offerStatus = RequestStatus.Success;
        state.offer = action.payload;
      })
      .addCase(fetchOffer.rejected, (state, action) => {
        state.offerStatus = RequestStatus.Failed;
        state.offerStatusCode = action.payload?.status;
      })
      .addCase(fetchNearby.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(postFavorite.fulfilled, (state, action) => {
        if (state.offer && state.offer.id === action.payload.offer.id) {
          state.offer.isFavorite = action.payload.offer.isFavorite;
        }
      }),
  selectors: {
    selectNearbyOffers: (state: OfferState) => state.nearbyOffers,
    selectOffer: (state: OfferState) => state.offer,
    selectOfferStatus: (state: OfferState) => state.offerStatus,
    selectofferStatusCode: (state: OfferState) => state.offerStatusCode,
  },
});

export const offerActions = { ...offerSlice.actions, fetchOffer, fetchNearby };
export const {
  selectNearbyOffers,
  selectOffer,
  selectOfferStatus,
  selectofferStatusCode,
} = offerSlice.selectors;

export const selectLimitedNearbyOffers = createSelector(
  [selectNearbyOffers],
  (nearbyOffers) => nearbyOffers.slice(0, MAX_NEARBY_COUNT),
);

export const selectOfferImages = createSelector(
  [selectOffer],
  (offer) => offer?.images.slice(0, MAX_IMAGES_COUNT) ?? [],
);
