import { RequestStatus } from '@/const';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectFavoriteCount } from '@/store/favorite/favorite-slice';
import { selectStatus } from '@/store/slices/offers-slice';
import classNames from 'classnames';
import { memo, ReactNode } from 'react';
import MemoizedHeader from './header';

interface LayoutProps {
  isPageMain?: boolean;
  isPageLogin?: boolean;
  isPageFavouriteEmpty?: boolean;
  children: ReactNode;
}

function Layout({
  children,
  isPageMain,
  isPageLogin,
  isPageFavouriteEmpty,
}: LayoutProps): JSX.Element | ReactNode {
  const favouriteCount = useAppSelector(selectFavoriteCount);
  const status = useAppSelector(selectStatus);

  if (status === RequestStatus.Loading) {
    return children;
  }

  return (
    <div
      className={classNames(
        'page',
        { 'page--gray page--main': isPageMain },
        { 'page--gray page--login': isPageLogin },
        { 'page--favorites-empty': isPageFavouriteEmpty },
      )}
    >
      <MemoizedHeader
        favouriteCount={favouriteCount}
        typeLogo={'header'}
        isPageMain={isPageMain}
        isPageLogin={isPageLogin}
      />
      {children}
    </div>
  );
}

const MemoizedLayout = memo(Layout);
export default MemoizedLayout;
