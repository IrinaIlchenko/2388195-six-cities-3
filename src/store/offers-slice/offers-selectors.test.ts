import { RequestStatus } from '@/const';
import { ListOffers } from '@/types/offer';
import {
  selectOffers,
  selectStatus,
  selectOffersStatus,
  selectOffersByCity,
} from './offers-slice';
import { RootState } from '@/types/store';

describe('Offers selectors', () => {
  const offers: ListOffers = [
    {
      id: '1',
      title: 'Beautiful & luxurious studio at great location',
      type: 'apartment',
      price: 120,
      previewImage: 'img/apartment-01.jpg',
      city: {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.35222,
          zoom: 16,
        },
      },
      location: {
        latitude: 48.85661,
        longitude: 2.35222,
        zoom: 16,
      },
      isFavorite: true,
      isPremium: false,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Wood and stone place',
      type: 'room',
      price: 80,
      previewImage: 'img/room.jpg',
      city: {
        name: 'Amsterdam',
        location: {
          latitude: 52.37454,
          longitude: 4.89798,
          zoom: 16,
        },
      },
      location: {
        latitude: 52.37454,
        longitude: 4.89798,
        zoom: 16,
      },
      isFavorite: false,
      isPremium: false,
      rating: 4.5,
    },
    {
      id: '3',
      title: 'Canal view apartment',
      type: 'apartment',
      price: 150,
      previewImage: 'img/city-center.jpg',
      city: {
        name: 'Amsterdam',
        location: {
          latitude: 52.37454,
          longitude: 4.89798,
          zoom: 16,
        },
      },
      location: {
        latitude: 52.37454,
        longitude: 4.89798,
        zoom: 16,
      },
      isFavorite: true,
      isPremium: true,
      rating: 4.9,
    },
  ];

  const state = {
    offers: {
      offers,
      status: RequestStatus.Success,
    },
  } as RootState;

  it('should return offers from state', () => {
    expect(selectOffers(state)).toBe(offers);
  });

  it('should return status from state', () => {
    expect(selectStatus(state)).toBe(RequestStatus.Success);
  });

  it('should return offers status flags for Success', () => {
    expect(selectOffersStatus(state)).toEqual({
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
  });

  it('should return offers status flags for Loading', () => {
    const loadingState = {
      offers: {
        offers,
        status: RequestStatus.Loading,
      },
    };

    expect(selectOffersStatus(loadingState)).toEqual({
      isLoading: true,
      isError: false,
      isSuccess: false,
    });
  });

  it('should return filtered offers by city Paris', () => {
    expect(selectOffersByCity(state, 'Paris')).toEqual([offers[0]]);
  });

  it('should return filtered offers by city Amsterdam', () => {
    expect(selectOffersByCity(state, 'Amsterdam')).toEqual([
      offers[1],
      offers[2],
    ]);
  });

  it('should be case-insensitive when filtering by city', () => {
    expect(selectOffersByCity(state, 'amsterdam')).toEqual([
      offers[1],
      offers[2],
    ]);
  });

  it('should return empty array when city not found', () => {
    expect(selectOffersByCity(state, 'Berlin')).toEqual([]);
  });
});
