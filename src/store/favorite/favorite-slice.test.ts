import { RequestStatus, FavoriteStatus } from '@/const';
import {
  favoriteSlice,
  selectFavoriteOffers,
  selectFavoriteOffersStatus,
  selectFavoriteCount,
  selectGroupedFavoriteOffers,
} from './favorite-slice';
import { fetchFavorites, postFavorite } from '../thunk/favorite';
import { FullOffer } from '@/types/offer';

describe('Favorite Slice', () => {
  const mockOffer1 = {
    id: '1',
    title: 'Beautiful apartment',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    },
    previewImage: 'img/1.jpg',
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    type: 'apartment',
    price: 120,
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    description:
      'A quiet cozy and picturesque that hides behind a a river by the luck feel.',
    bedrooms: 3,
    goods: ['Heating', 'Kitchen', 'Wi-Fi'],
    host: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true,
    },
    images: ['img/1.jpg'],
    maxAdults: 4,
  } as FullOffer;

  const mockOffer2 = {
    id: '2',
    title: 'Cozy room',
    city: {
      name: 'Paris',
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    },
    previewImage: 'img/2.jpg',
    isFavorite: true,
    isPremium: false,
    rating: 4.8,
    type: 'room',
    price: 80,
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    description: 'Cozy room in the city center',
    bedrooms: 1,
    goods: ['Wi-Fi'],
    host: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false,
    },
    images: ['img/2.jpg'],
    maxAdults: 2,
  } as FullOffer;

  const rootState = {
    favoriteOffers: {
      favoriteOffer: null,
      favoriteOffers: [mockOffer1, mockOffer2],
      favoriteOfferStatus: RequestStatus.Success,
    },
  };

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const result = favoriteSlice.reducer(undefined, emptyAction);

    expect(result).toEqual({
      favoriteOffer: null,
      favoriteOffers: [],
      favoriteOfferStatus: RequestStatus.Idle,
    });
  });

  describe('fetchFavorites extraReducers', () => {
    it('should set status to "Loading" on fetchFavorites.pending', () => {
      const state = favoriteSlice.reducer(
        undefined,
        fetchFavorites.pending('', undefined),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Loading);
    });

    it('should set status to "Success" and update favoriteOffers on fetchFavorites.fulfilled', () => {
      const offers = [mockOffer1, mockOffer2];
      const state = favoriteSlice.reducer(
        undefined,
        fetchFavorites.fulfilled(offers, '', undefined),
      );

      expect(state).toEqual({
        favoriteOffer: null,
        favoriteOffers: offers,
        favoriteOfferStatus: RequestStatus.Success,
      });
    });

    it('should set status to "Failed" on fetchFavorites.rejected', () => {
      const state = favoriteSlice.reducer(
        undefined,
        fetchFavorites.rejected(new Error('Request failed'), '', undefined),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('postFavorite extraReducers', () => {
    const postArgs = {
      offerId: mockOffer1.id,
      favoriteStatus: FavoriteStatus.Added,
    };

    it('should set status to "Loading" on postFavorite.pending', () => {
      const state = favoriteSlice.reducer(
        undefined,
        postFavorite.pending('', postArgs),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Loading);
    });

    it('should add offer to favoriteOffers and set status to "Success" on postFavorite.fulfilled with Added', () => {
      const state = favoriteSlice.reducer(
        {
          favoriteOffer: null,
          favoriteOffers: [],
          favoriteOfferStatus: RequestStatus.Loading,
        },
        postFavorite.fulfilled(
          { offer: mockOffer1, favoriteStatus: FavoriteStatus.Added },
          '',
          postArgs,
        ),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Success);
      expect(state.favoriteOffers).toHaveLength(1);
      expect(state.favoriteOffers[0]).toEqual(mockOffer1);
    });

    it('should remove offer from favoriteOffers and set status to "Success" on postFavorite.fulfilled with Removed', () => {
      const state = favoriteSlice.reducer(
        {
          favoriteOffer: null,
          favoriteOffers: [mockOffer1, mockOffer2],
          favoriteOfferStatus: RequestStatus.Loading,
        },
        postFavorite.fulfilled(
          { offer: mockOffer1, favoriteStatus: FavoriteStatus.Removed },
          '',
          { offerId: mockOffer1.id, favoriteStatus: FavoriteStatus.Removed },
        ),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Success);
      expect(state.favoriteOffers).toEqual([mockOffer2]);
    });

    it('should set status to "Failed" on postFavorite.rejected', () => {
      const state = favoriteSlice.reducer(
        undefined,
        postFavorite.rejected(new Error('Request failed'), '', postArgs),
      );

      expect(state.favoriteOfferStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('selectors', () => {
    it('should select favorite offers', () => {
      expect(selectFavoriteOffers(rootState)).toEqual([mockOffer1, mockOffer2]);
    });

    it('should select favorite offers status', () => {
      expect(selectFavoriteOffersStatus(rootState)).toBe(RequestStatus.Success);
    });

    it('should select favorite count', () => {
      expect(selectFavoriteCount(rootState)).toBe(2);
    });

    it('should select grouped favorite offers', () => {
      const grouped = selectGroupedFavoriteOffers(rootState);

      expect(grouped).toBeDefined();
    });
  });
});
