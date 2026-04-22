import { RequestStatus } from '@/const';
import {
  selectFavoriteOffers,
  selectFavoriteOffersStatus,
  selectFavoriteCount,
  selectGroupedFavoriteOffers,
} from './favorite-slice';
import { FullOffers } from '@/types/offer';
import { groupOffersByCity } from '@/util';

describe('Favorite selectors', () => {
  const favoriteOffers: FullOffers = [
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
      description: 'A quiet cozy and picturesque place.',
      bedrooms: 2,
      goods: ['Wi-Fi', 'Heating', 'Kitchen'],
      host: {
        name: 'Angelina',
        avatarUrl: 'img/avatar-angelina.jpg',
        isPro: true,
      },
      images: ['img/1.png', 'img/2.png'],
      maxAdults: 4,
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
      isFavorite: true,
      isPremium: false,
      rating: 4.5,
      description: 'Nice and comfortable room in the center.',
      bedrooms: 1,
      goods: ['Wi-Fi', 'Coffee machine'],
      host: {
        name: 'Max',
        avatarUrl: 'img/avatar-max.jpg',
        isPro: false,
      },
      images: ['img/3.png', 'img/4.png'],
      maxAdults: 2,
    },
  ];

  const state = {
    favoriteOffers: {
      favoriteOffer: null,
      favoriteOffers,
      favoriteOfferStatus: RequestStatus.Success,
    },
  };

  it('should return favorite offers from state', () => {
    const { favoriteOffers: expectedFavoriteOffers } = state.favoriteOffers;
    const result = selectFavoriteOffers(state);

    expect(result).toBe(expectedFavoriteOffers);
  });

  it('should return favorite offers status from state', () => {
    const { favoriteOfferStatus } = state.favoriteOffers;
    const result = selectFavoriteOffersStatus(state);

    expect(result).toBe(favoriteOfferStatus);
  });

  it('should return favorite offers count', () => {
    const result = selectFavoriteCount(state);

    expect(result).toBe(favoriteOffers.length);
  });

  it('should return grouped favorite offers', () => {
    const result = selectGroupedFavoriteOffers(state);

    expect(result).toEqual(groupOffersByCity(favoriteOffers));
  });
});
