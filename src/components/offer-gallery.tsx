import { useAppSelector } from '@/hooks/store-hooks';
import { selectOfferImages } from '@/store/offer-slice/offer-slice';
import { memo } from 'react';
import OfferImage from './offer-image';

function OfferGallery(): JSX.Element {
  const imagesToShow = useAppSelector(selectOfferImages);
  return (
    <div className="offer__gallery-container container">
      <div className="offer__gallery">
        {imagesToShow.map((image) => (
          <OfferImage key={image} image={image} />
        ))}
      </div>
    </div>
  );
}

const MemoizedOfferGallery = memo(OfferGallery);
export default MemoizedOfferGallery;
