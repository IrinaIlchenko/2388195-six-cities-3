import OfferNearPlacesList from './offer-near-places-list';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectLimitedNearbyOffers } from '@/store/offer-slice/offer-slice';
import { memo } from 'react';

function OfferNearPlaces(): JSX.Element {
  const nearOffers = useAppSelector(selectLimitedNearbyOffers);

  if (nearOffers.length === 0) {
    return (
      <section className="near-places places">
        <h2 className="near-places__title">No offers found</h2>
      </section>
    );
  }

  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <OfferNearPlacesList nearOffers={nearOffers} />
    </section>
  );
}

const MemoizedOfferNearPlaces = memo(OfferNearPlaces);
export default MemoizedOfferNearPlaces;
