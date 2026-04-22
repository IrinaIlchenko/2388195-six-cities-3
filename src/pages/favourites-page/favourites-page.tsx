import MemoizedLogo from '@/components/logo';
import { useAppSelector, useDocumentTitle } from '@/hooks/store-hooks';
import { selectFavoriteCount } from '@/store/favorite/favorite-slice';
import classNames from 'classnames';
import MemoizedFavouriteList from '../../components/favourites-list';
import MemoizedFavouriteEmpty from '../../components/favourite-empty';
import MemoizedLayout from '@/components/layout';
import { memo } from 'react';

function FavouritePage(): JSX.Element {
  useDocumentTitle('Favourite page');
  const favouriteCount = useAppSelector(selectFavoriteCount);

  return (
    <MemoizedLayout isPageFavouriteEmpty>
      <main
        className={classNames(
          'page__main',
          'page__main--favorites',
          favouriteCount === 0 && 'page__main--favorites-empty',
        )}
      >
        <div className="page__favorites-container container">
          {favouriteCount === 0 ? (
            <MemoizedFavouriteEmpty />
          ) : (
            <MemoizedFavouriteList />
          )}
        </div>
      </main>
      <footer className="footer">
        <MemoizedLogo type="footer" />
      </footer>
    </MemoizedLayout>
  );
}

const MemoizedFavouritePage = memo(FavouritePage);
export default MemoizedFavouritePage;
