import { AppRoute } from '@/const';
import { useAppDispatch } from '@/hooks/store-hooks';
import { ListOffer } from '@/types/offer';
import { getStarActiveWidth, formattedType } from '@/util';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import MemoizedFavoriteButton from './favorite-button';
import { appActions } from '@/store/app/app-slice';
import { memo, useCallback, useMemo } from 'react';

interface PlaceCardProps {
  currentOffer: ListOffer;
  cardType: 'favorites' | 'cities' | 'near-places';
  hovered?: boolean;
}

const sizes = {
  favorites: {
    width: 150,
    height: 110,
  },
  cities: {
    width: 260,
    height: 200,
  },
  'near-places': {
    width: 260,
    height: 200,
  },
};

function PlaceCard({
  currentOffer,
  cardType,
  hovered,
}: PlaceCardProps): JSX.Element {
  const dispatch = useAppDispatch();

  const {
    id,
    isPremium,
    previewImage,
    price,
    title,
    type,
    rating,
    isFavorite,
  } = currentOffer;

  const starActiveWidth = useMemo(
    () => getStarActiveWidth(Math.round(rating)),
    [rating],
  );

  const { width, height } = sizes[cardType];
  const placeType = useMemo(() => formattedType(type), [type]);

  const handleMouseEnter = useCallback(() => {
    if (hovered) {
      dispatch(appActions.setActiveId(id));
    }
  }, [dispatch, hovered, id]);

  const handleMouseLeave = useCallback(() => {
    if (hovered) {
      dispatch(appActions.setActiveId(null));
    }
  }, [dispatch, hovered]);

  return (
    <article
      className={`${cardType}__card place-card`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <Link to={`${AppRoute.Offer}/${id}`}>
        <div className={`${cardType}__image-wrapper place-card__image-wrapper`}>
          <img
            className="place-card__image"
            src={previewImage}
            width={width}
            height={height}
            alt="Place image"
          />
        </div>
      </Link>
      <div
        className={classNames(
          'place-card__info',
          cardType === 'favorites' && 'favorites__card-info',
        )}
      >
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <MemoizedFavoriteButton
            buttonType={'place-card'}
            offerId={id}
            isFavorite={isFavorite}
          />
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: starActiveWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{placeType}</p>
      </div>
    </article>
  );
}

const MemoizedPlaceCard = memo(PlaceCard);
export default MemoizedPlaceCard;
