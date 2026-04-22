import { AppRoute } from '@/const';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectRandomCity } from '@/store/app/app-slice';
import { memo } from 'react';
import { Link } from 'react-router-dom';

function LoginLocation(): JSX.Element {
  const randomCity = useAppSelector(selectRandomCity);
  const randomCityRoute = randomCity.toLowerCase();

  return (
    <section className="locations locations--login locations--current">
      <div className="locations__item">
        <Link
          to={`${AppRoute.Root}${randomCityRoute}`}
          className="locations__item-link"
        >
          <span>{randomCity}</span>
        </Link>
      </div>
    </section>
  );
}

const MemoizedLoginLocation = memo(LoginLocation);
export default MemoizedLoginLocation;
