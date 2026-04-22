import { MAX_IMAGES_COUNT, MAX_NEARBY_COUNT, RequestStatus } from '@/const';
import {
  selectOffer,
  selectNearbyOffers,
  selectOfferStatus,
  selectofferStatusCode,
  selectLimitedNearbyOffers,
  selectOfferImages
} from './offer-slice';
import { FullOffer, ListOffers } from '@/types/offer';

describe('Offer selectors', () => {
  const mockOffer = {
    id: 'offer-1',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg'],
  } as FullOffer;

  const mockNearbyOffers = [
    { id: 'n1' }, { id: 'n2' }, { id: 'n3' }, { id: 'n4' }
  ] as ListOffers;

  const state = {
    offer: {
      offer: mockOffer,
      nearbyOffers: mockNearbyOffers,
      offerStatus: RequestStatus.Success,
      offerStatusCode: 200,
    }
  };

  it('should return offer from state', () => {
    expect(selectOffer(state)).toBe(mockOffer);
  });

  it('should return nearby offers from state', () => {
    expect(selectNearbyOffers(state)).toBe(mockNearbyOffers);
  });

  it('should return offer status from state', () => {
    expect(selectOfferStatus(state)).toBe(RequestStatus.Success);
  });

  it('should return status code from state', () => {
    expect(selectofferStatusCode(state)).toBe(200);
  });

  it('should return limited nearby offers based on MAX_NEARBY_COUNT', () => {
    const result = selectLimitedNearbyOffers(state);

    expect(result.length).toBeLessThanOrEqual(MAX_NEARBY_COUNT);

    expect(result).toEqual(mockNearbyOffers.slice(0, MAX_NEARBY_COUNT));
  });

  it('should return limited offer images based on MAX_IMAGES_COUNT', () => {
    const images = selectOfferImages(state);
    expect(images.length).toBeLessThanOrEqual(MAX_IMAGES_COUNT);
    expect(images).toEqual(mockOffer.images.slice(0, MAX_IMAGES_COUNT));
  });

  it('should return empty array for images if offer is null', () => {
    const emptyState = {
      offer: {
        ...state.offer,
        offer: null,
      }
    };
    expect(selectOfferImages(emptyState)).toEqual([]);
  });
});
