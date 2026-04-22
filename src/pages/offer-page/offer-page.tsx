import MemoizedLayout from '@/components/layout';
import MemoizedOffer from '@/components/offer';
import MemoizedOfferGallery from '@/components/offer-gallery';
import MemoizedOfferNearPlaces from '@/components/offer-near-places';
import { RequestStatus, AppRoute } from '@/const';
import {
  useAppSelector,
  useAppDispatch,
  useDocumentTitle,
} from '@/hooks/store-hooks';
import { commentsActions } from '@/store/comments/comments-slice';
import {
  selectOffer,
  selectOfferStatus,
  offerActions,
  selectofferStatusCode,
  selectLimitedNearbyOffers,
} from '@/store/slices/offer-slice';
import { fetchOffer, fetchNearby, fetchComments } from '@/store/thunk/offer';
import { memo, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import MemoizedErrorPage from '../error-page/error-page';
import MemoizedCitiesMap from '@/components/cities-map';
import MemoizedSpinner from '@/components/spinner/spinner';

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const offer = useAppSelector(selectOffer);
  const offerStatus = useAppSelector(selectOfferStatus);
  const offerStatusCode = useAppSelector(selectofferStatusCode);
  const nearOffers = useAppSelector(selectLimitedNearbyOffers);
  const dispatch = useAppDispatch();

  useDocumentTitle('Offer page');

  useEffect(() => {
    if (id) {
      dispatch(fetchOffer(id));
      dispatch(fetchNearby(id));
      dispatch(fetchComments(id));
    }

    return () => {
      dispatch(offerActions.clear());
      dispatch(commentsActions.clear());
    };
  }, [id, dispatch]);

  if (
    offerStatus === RequestStatus.Loading ||
    offerStatus === RequestStatus.Idle
  ) {
    return <MemoizedSpinner />;
  }

  if (offerStatus === RequestStatus.Failed || !offer) {
    if (offerStatusCode === 404) {
      return <Navigate to={AppRoute.NotFound} />;
    }
    return <MemoizedErrorPage />;
  }

  return (
    <MemoizedLayout>
      <main className="page__main page__main--offer">
        <section className="offer">
          <MemoizedOfferGallery />
          <MemoizedOffer />
          <MemoizedCitiesMap
            className="offer__map"
            currentOffers={nearOffers}
            currentOffer={offer}
            currentCity={offer.city.name}
          />
        </section>
        <div className="container">
          <MemoizedOfferNearPlaces />
        </div>
      </main>
    </MemoizedLayout>
  );
}

const MemoizedOfferPage = memo(OfferPage);
export default MemoizedOfferPage;
