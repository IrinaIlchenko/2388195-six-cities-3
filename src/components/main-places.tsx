import { SortType } from '@/const';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import { appActions, selectActiveSort } from '@/store/app/app-slice';
import { ListOffers, CityName } from '@/types/offer';
import { getSortedOffers, formattedType, formattedOffersNumber } from '@/util';
import MemoizedPlaceCard from './place-card';
import MemoizedSortingOffers from './sorting-offers';
import { memo, useCallback, useMemo } from 'react';

interface MainPlacesProps {
  currentOffers: ListOffers;
  currentCity: CityName;
}

function MainPlaces({
  currentOffers,
  currentCity,
}: MainPlacesProps): JSX.Element {
  const dispatch = useAppDispatch();
  const activeSort = useAppSelector(selectActiveSort);

  const setSort = useCallback(
    (type: SortType) => {
      dispatch(appActions.setActiveSort(type));
    },
    [dispatch],
  );

  const sortedOffers = useMemo(
    () => getSortedOffers(currentOffers, activeSort),
    [currentOffers, activeSort],
  );

  return (
    <section className="cities__places places">
      <h2 className="visually-hidden">Places</h2>
      <b className="places__found">
        {formattedOffersNumber(currentOffers.length)} to stay in{' '}
        {formattedType(currentCity)}
      </b>
      <MemoizedSortingOffers onChangeSort={setSort} />
      <div className="cities__places-list places__list tabs__content">
        {sortedOffers.map((currentOffer) => (
          <MemoizedPlaceCard
            key={currentOffer.id}
            currentOffer={currentOffer}
            cardType="cities"
            hovered
          />
        ))}
      </div>
    </section>
  );
}

const MemoizedMainPlaces = memo(MainPlaces);
export default MemoizedMainPlaces;
