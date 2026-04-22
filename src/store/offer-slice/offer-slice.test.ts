import {
  RequestStatus,
  MAX_NEARBY_COUNT,
  MAX_IMAGES_COUNT,
  FavoriteStatus,
} from '@/const';
import {
  offerSlice,
  selectOffer,
  selectOfferStatus,
  selectofferStatusCode,
  selectLimitedNearbyOffers,
  selectOfferImages,
} from './offer-slice';
import { fetchOffer, fetchNearby } from '../thunk/offer';
import { postFavorite } from '../thunk/favorite';
import { FullOffer, ListOffers } from '@/types/offer';

describe('Offer Slice', () => {
  const mockOffer = {
    id: 'offer-1',
    title: 'Beautiful house',
    images: [
      'img1.jpg',
      'img2.jpg',
      'img3.jpg',
      'img4.jpg',
      'img5.jpg',
      'img6.jpg',
      'img7.jpg',
    ],
    isFavorite: false,
    rating: 4.5,
  } as FullOffer;

  const mockNearbyOffers = [
    { id: 'near-1' },
    { id: 'near-2' },
    { id: 'near-3' },
    { id: 'near-4' },
  ] as ListOffers;

  const requestId = 'req-123';
  const offerId = 'offer-1';

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = offerSlice.reducer(undefined, emptyAction);

    expect(result).toEqual({
      offer: null,
      nearbyOffers: [],
      offerStatus: RequestStatus.Idle,
      offerStatusCode: undefined,
    });
  });

  it('should clear state with clear action', () => {
    const filledState = {
      offer: mockOffer,
      nearbyOffers: mockNearbyOffers,
      offerStatus: RequestStatus.Success,
      offerStatusCode: 200,
    };

    const result = offerSlice.reducer(filledState, offerSlice.actions.clear());

    expect(result).toEqual({
      offer: null,
      nearbyOffers: [],
      offerStatus: RequestStatus.Idle,
      offerStatusCode: undefined,
    });
  });

  describe('fetchOffer extraReducers', () => {
    it('should set status to Loading on fetchOffer.pending', () => {
      const state = offerSlice.reducer(
        undefined,
        fetchOffer.pending(requestId, offerId),
      );
      expect(state.offerStatus).toBe(RequestStatus.Loading);
    });

    it('should set Success and update offer on fetchOffer.fulfilled', () => {
      const state = offerSlice.reducer(
        undefined,
        fetchOffer.fulfilled(mockOffer, requestId, offerId),
      );

      expect(state.offerStatus).toBe(RequestStatus.Success);
      expect(state.offer).toEqual(mockOffer);
    });

    it('should set Failed and status code on fetchOffer.rejected', () => {
      const payload = { status: 404, message: 'Not Found' };

      const state = offerSlice.reducer(
        undefined,
        fetchOffer.rejected(null, requestId, offerId, payload),
      );

      expect(state.offerStatus).toBe(RequestStatus.Failed);
      expect(state.offerStatusCode).toBe(404);
    });
  });

  describe('fetchNearby extraReducers', () => {
    it('should update nearbyOffers on fetchNearby.fulfilled', () => {
      const state = offerSlice.reducer(
        undefined,
        fetchNearby.fulfilled(mockNearbyOffers, requestId, offerId),
      );

      expect(state.nearbyOffers).toEqual(mockNearbyOffers);
    });
  });

  describe('postFavorite extraReducers', () => {
    it('should update isFavorite when id matches', () => {
      const initialState = {
        offer: { ...mockOffer, isFavorite: false },
        nearbyOffers: [],
        offerStatus: RequestStatus.Success,
        offerStatusCode: undefined,
      };

      const actionPayload = {
        offer: { ...mockOffer, isFavorite: true },
        favoriteStatus: FavoriteStatus.Added,
      };

      const actionMetaArg = {
        offerId: mockOffer.id,
        favoriteStatus: FavoriteStatus.Added,
      };

      const state = offerSlice.reducer(
        initialState,
        postFavorite.fulfilled(actionPayload, requestId, actionMetaArg),
      );

      expect(state.offer?.isFavorite).toBe(true);
    });

    it('should not update isFavorite if id does not match', () => {
      const initialState = {
        offer: { ...mockOffer, isFavorite: false },
        nearbyOffers: [],
        offerStatus: RequestStatus.Success,
        offerStatusCode: undefined,
      };

      const actionPayload = {
        offer: { ...mockOffer, id: 'other-id', isFavorite: true },
        favoriteStatus: FavoriteStatus.Added,
      };

      const actionMetaArg = {
        offerId: 'other-id',
        favoriteStatus: FavoriteStatus.Added,
      };

      const state = offerSlice.reducer(
        initialState,
        postFavorite.fulfilled(actionPayload, requestId, actionMetaArg),
      );

      expect(state.offer?.isFavorite).toBe(false);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      offer: {
        offer: mockOffer,
        nearbyOffers: mockNearbyOffers,
        offerStatus: RequestStatus.Success,
        offerStatusCode: 200,
      },
    };

    it('should select offer data', () => {
      expect(selectOffer(rootState)).toEqual(mockOffer);
      expect(selectOfferStatus(rootState)).toBe(RequestStatus.Success);
      expect(selectofferStatusCode(rootState)).toBe(200);
    });

    it('should select nearby offers with limit', () => {
      const limited = selectLimitedNearbyOffers(rootState);
      expect(limited).toEqual(mockNearbyOffers.slice(0, MAX_NEARBY_COUNT));
    });

    it('should select offer images with limit', () => {
      const images = selectOfferImages(rootState);
      expect(images).toEqual(mockOffer.images.slice(0, MAX_IMAGES_COUNT));
    });

    it('should return empty array for images if offer is null', () => {
      const emptyState = {
        offer: {
          offer: null,
          nearbyOffers: [],
          offerStatus: RequestStatus.Idle,
          offerStatusCode: undefined,
        },
      };

      expect(selectOfferImages(emptyState)).toEqual([]);
    });
  });
});
