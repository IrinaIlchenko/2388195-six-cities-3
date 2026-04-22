import { RequestStatus } from '@/const';
import { ListOffers } from '@/types/offer';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { postFavorite } from '../thunk/favorite';
import { fetchAllOffers } from '../thunk/offers';
import { RootState } from '@/types/store';

interface OffersState {
  offers: ListOffers;
  status: RequestStatus;
}

const initialState: OffersState = {
  offers: [],
  status: RequestStatus.Idle,
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAllOffers.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state) => {
        state.status = RequestStatus.Failed;
      })
      .addCase(postFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload.offer;
        const offerIndex = state.offers.findIndex((offer) => offer.id === updatedOffer.id);

        if (offerIndex !== -1) {
          state.offers[offerIndex].isFavorite = updatedOffer.isFavorite;
        }
      }),
  selectors: {
    selectOffers: (state: OffersState) => state.offers,
    selectStatus: (state: OffersState) => state.status,
  },
});

export const offersActions = {...offersSlice.actions, fetchAllOffers};
export const { selectOffers, selectStatus } = offersSlice.selectors;

export const selectOffersStatus = createSelector(
  [selectStatus],
  (status) => ({
    isLoading: status === RequestStatus.Idle || status === RequestStatus.Loading,
    isError: status === RequestStatus.Failed,
    isSuccess: status === RequestStatus.Success,
  })
)

export const selectOffersByCity = createSelector(
  [selectOffers, (_state: RootState, city: string) => city],
  (offers, city) => offers.filter((offer) => offer.city.name.toLowerCase() === city.toLowerCase())
);
