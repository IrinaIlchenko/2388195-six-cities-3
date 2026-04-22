import { useAppSelector } from '@/hooks/store-hooks';
import { formattedType, getStarActiveWidth } from '@/util';
import MemoizedFavoriteButton from './favorite-button';
import MemoizedOfferForm from './offer-form';
import MemoizedOfferReviews from './offer-rewiews/offer-reviews';
import classNames from 'classnames';
import { memo, useMemo } from 'react';
import { selectOffer } from '@/store/offer-slice/offer-slice';
import { selectIsAuthorized } from '@/store/user-slice/user-slice';

function Offer() {
  const offer = useAppSelector(selectOffer);
  const isAuth = useAppSelector(selectIsAuthorized);

  const starActiveWidth = useMemo(
    () => (offer ? getStarActiveWidth(Math.round(offer.rating)) : ''),
    [offer],
  );

  const renderedGoods = useMemo(
    () =>
      offer?.goods.map((good) => (
        <li key={good} className="offer__inside-item">
          {good}
        </li>
      )),
    [offer?.goods],
  );

  if (!offer) {
    return null;
  }

  const {
    isPremium,
    title,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    host,
    description,
    id: offerId,
    isFavorite,
  } = offer;

  const formattedBedrooms = (count: number): string =>
    `${count} ${count > 1 ? 'Bedrooms' : 'Bedroom'}`;

  const formattedAdults = (count: number): string =>
    `${count} ${count > 1 ? 'adults' : 'adult'}`;

  return (
    <div className="offer__container container">
      <div className="offer__wrapper">
        {isPremium && (
          <div className="offer__mark">
            <span>Premium</span>
          </div>
        )}
        <div className="offer__name-wrapper">
          <h1 className="offer__name">{title}</h1>
          <MemoizedFavoriteButton
            buttonType={'offer'}
            offerId={offerId}
            isFavorite={isFavorite}
          />
        </div>
        <div className="offer__rating rating">
          <div className="offer__stars rating__stars">
            <span style={{ width: starActiveWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
          <span className="offer__rating-value rating__value">{rating}</span>
        </div>
        <ul className="offer__features">
          <li className="offer__feature offer__feature--entire">
            {formattedType(type)}
          </li>
          <li className="offer__feature offer__feature--bedrooms">
            {formattedBedrooms(bedrooms)}
          </li>
          <li className="offer__feature offer__feature--adults">
            Max {formattedAdults(maxAdults)}
          </li>
        </ul>
        <div className="offer__price">
          <b className="offer__price-value">&euro;{price}</b>
          <span className="offer__price-text">&nbsp;night</span>
        </div>
        <div className="offer__inside">
          <h2 className="offer__inside-title">What&apos;s inside</h2>
          <ul className="offer__inside-list">{renderedGoods}</ul>
        </div>
        <div className="offer__host">
          <h2 className="offer__host-title">Meet the host</h2>
          <div className="offer__host-user user">
            <div
              className={classNames(
                'offer__avatar-wrapper user__avatar-wrapper',
                {
                  [`offer__avatar-wrapper--pro`]: host.isPro,
                },
              )}
            >
              <img
                className="offer__avatar user__avatar"
                src={host.avatarUrl}
                width="74"
                height="74"
                alt="Host avatar"
              />
            </div>
            <span className="offer__user-name">{host.name}</span>
            {host.isPro && <span className="offer__user-status">{'Pro'}</span>}
          </div>
          <div className="offer__description">
            <p className="offer__text">{description}</p>
          </div>
        </div>
        <section className="offer__reviews reviews">
          <MemoizedOfferReviews />
          {isAuth && <MemoizedOfferForm />}
        </section>
      </div>
    </div>
  );
}

const MemoizedOffer = memo(Offer);
export default MemoizedOffer;
