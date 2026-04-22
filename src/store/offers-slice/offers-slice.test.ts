import { RequestStatus } from '@/const';
import type { FullOffer, ListOffer } from '@/types/offer';
import type { RootState } from '@/types/store';
import { offersSlice, selectOffers, selectStatus, selectOffersStatus, selectOffersByCity } from './offers-slice';
import { fetchAllOffers } from '../thunk/offers';
import { postFavorite } from '../thunk/favorite';

describe('offersSlice', () => {
  const mockOffer: ListOffer = {
    id: '1',
    title: 'Nice apartment',
    type: 'apartment',
    price: 120,
    previewImage: 'img/1.jpg',
    city: {
      name: 'Paris',
      location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 },
    },
    location: { latitude: 48.857, longitude: 2.351, zoom: 16 },
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
  };

  const secondMockOffer: ListOffer = {
    ...mockOffer,
    id: '2',
    city: {
      ...mockOffer.city,
      name: 'Amsterdam',
    },
  };

  const mockFullOffer: FullOffer = {
    ...mockOffer,
    description: 'Great place',
    bedrooms: 2,
    goods: ['Wi-Fi', 'Kitchen'],
    host: {
      name: 'Jack',
      avatarUrl: 'img/avatar.jpg',
      isPro: false,
    },
    images: ['img/1.jpg', 'img/2.jpg'],
    maxAdults: 4,
  };

  const requestId = 'request-123';

  const createRootState = (offers: ListOffer[], status: RequestStatus): RootState =>
    ({
      app: {} as RootState['app'],
      offers: {
        offers,
        status,
      },
      offer: {} as RootState['offer'],
      comments: {} as RootState['comments'],
      user: {} as RootState['user'],
      favoriteOffers: {} as RootState['favoriteOffers'],
    }) as RootState;

  it('should return initial state', () => {
    expect(offersSlice.reducer(undefined, { type: '' })).toEqual({
      offers: [],
      status: RequestStatus.Idle,
    });
  });

  describe('fetchAllOffers extraReducers', () => {
    it('should set Loading on pending', () => {
      const state = offersSlice.reducer(
        undefined,
        fetchAllOffers.pending(requestId, undefined),
      );
      expect(state.status).toBe(RequestStatus.Loading);
    });

    it('should set Success and update offers on fulfilled', () => {
      const state = offersSlice.reducer(
        undefined,
        fetchAllOffers.fulfilled([mockOffer, secondMockOffer], requestId, undefined),
      );
      expect(state.status).toBe(RequestStatus.Success);
      expect(state.offers).toEqual([mockOffer, secondMockOffer]);
    });
  });

  describe('postFavorite extraReducers', () => {
    it('should update isFavorite for existing offer on fulfilled', () => {
      const initialState = {
        offers: [mockOffer, secondMockOffer],
        status: RequestStatus.Success,
      };

      const updatedFullOffer: FullOffer = {
        ...mockFullOffer,
        isFavorite: true,
      };

      const state = offersSlice.reducer(
        initialState,
        postFavorite.fulfilled(
          { offer: updatedFullOffer, favoriteStatus: 1 },
          requestId,
          { offerId: '1', favoriteStatus: 1 },
        ),
      );

      expect(state.offers[0].isFavorite).toBe(true);
    });
  });

  describe('selectors', () => {
    // В Redux Toolkit 2.0+ селекторы слайса ожидают объект с ключом имени слайса
    it('should select offers', () => {
      const rootState = createRootState([mockOffer, secondMockOffer], RequestStatus.Success);
      // Передаем весь rootState, так как автоматические селекторы ищут поле 'offers' в нем
      expect(selectOffers(rootState)).toEqual([mockOffer, secondMockOffer]);
    });

    it('should select status', () => {
      const rootState = createRootState([mockOffer], RequestStatus.Success);
      expect(selectStatus(rootState)).toBe(RequestStatus.Success);
    });

    it('should select derived offers status flags', () => {
      const rootState = createRootState([mockOffer], RequestStatus.Success);
      expect(selectOffersStatus(rootState)).toEqual({
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    });

    it('should select offers by city', () => {
      const rootState = createRootState([mockOffer, secondMockOffer], RequestStatus.Success);
      expect(selectOffersByCity(rootState, 'Paris')).toEqual([mockOffer]);
    });
  });
});
