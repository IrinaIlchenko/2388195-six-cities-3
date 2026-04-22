import MemoizedFavouriteLocations from '@/components/favorite-locations';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectGroupedFavoriteOffers } from '@/store/favorite/favorite-slice';
import { CityName } from '@/types/offer';
import { memo, useMemo } from 'react';

function FavouriteList(): JSX.Element {
  const groupedOffers = useAppSelector(selectGroupedFavoriteOffers);
  const groupedOfferEntries = useMemo(
    () => Object.entries(groupedOffers),
    [groupedOffers],
  );

  return (
    <section className="favorites">
      <h1 className="favorites__title">Saved listing</h1>
      <ul className="favorites__list">
        {groupedOfferEntries.map(([cityName, offers]) => (
          <MemoizedFavouriteLocations
            city={cityName as CityName}
            key={cityName}
            offers={offers}
          />
        ))}
      </ul>
    </section>
  );
}

const MemoizedFavouriteList = memo(FavouriteList);
export default MemoizedFavouriteList;
