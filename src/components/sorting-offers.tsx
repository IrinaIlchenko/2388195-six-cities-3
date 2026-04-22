import { SortType } from '@/const';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectActiveSort } from '@/store/app/app-slice';
import classNames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import MemoizedSortingOption from './sorting-option';

interface SortingOffersProps {
  onChangeSort: (type: SortType) => void;
}

function SortingOffers({ onChangeSort }: SortingOffersProps): JSX.Element {
  const currentSortType = useAppSelector(selectActiveSort);
  const [isOpened, setIsOpened] = useState(false);

  const sortTypes = useMemo(() => Object.values(SortType), []);

  const handleTypeClick = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const handleOptionClick = useCallback(
    (type: SortType) => {
      onChangeSort(type);
      setIsOpened(false);
    },
    [onChangeSort],
  );

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by </span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleTypeClick}
        role="button"
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={classNames('places__options', 'places__options--custom', {
          'places__options--opened': isOpened,
        })}
      >
        {sortTypes.map((type) => (
          <MemoizedSortingOption
            key={type}
            sortType={type}
            currentSortType={currentSortType}
            handleOptionClick={handleOptionClick}
          />
        ))}
      </ul>
    </form>
  );
}

const MemoizedSortingOffers = memo(SortingOffers);
export default MemoizedSortingOffers;
