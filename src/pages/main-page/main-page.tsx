import MemoizedCurrentOffers from '@/components/current-offers';
import MemoizedLayout from '@/components/layout';
import { AppRoute, CITIES_LIST, DEFAULT_CITY } from '@/const';
import { useAppSelector, useDocumentTitle } from '@/hooks/store-hooks';
import {
  selectOffersByCity,
  selectOffersStatus,
} from '@/store/offers-slice/offers-slice';
import { CityName } from '@/types/offer';
import classNames from 'classnames';
import { Navigate, useParams } from 'react-router-dom';
import MemoizedErrorPage from '../error-page/error-page';
import { memo, useMemo } from 'react';
import MemoizedMainTabs from '@/components/main-tabs';
import MemoizedSpinner from '@/components/spinner/spinner';

function MainPage(): JSX.Element {
  const { city } = useParams<{ city: CityName }>();

  useDocumentTitle('Main page');

  const currentCity = useMemo(() => city || DEFAULT_CITY, [city]);

  const { isLoading, isError } = useAppSelector(selectOffersStatus);
  const currentOffers = useAppSelector((state) =>
    selectOffersByCity(state, currentCity),
  );

  if (city?.toLowerCase && !CITIES_LIST.includes(city)) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  const isEmpty = currentOffers.length === 0;

  if (isLoading) {
    return <MemoizedSpinner />;
  }

  if (isError) {
    return <MemoizedErrorPage />;
  }

  return (
    <MemoizedLayout isPageMain>
      <main
        className={classNames('page__main', 'page__main--index', {
          'page__main--index-empty': isEmpty,
        })}
      >
        <h1 className="visually-hidden">Cities</h1>
        <MemoizedMainTabs currentCity={currentCity} />
        <div className="cities">
          <MemoizedCurrentOffers
            currentOffers={currentOffers}
            currentCity={currentCity}
            isEmpty={isEmpty}
          />
        </div>
      </main>
    </MemoizedLayout>
  );
}

const MemoizedMainPage = memo(MainPage);
export default MemoizedMainPage;
