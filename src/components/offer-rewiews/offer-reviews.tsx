import { MAX_COMMENTS_COUNT } from '@/const';
import MemoizedOfferReviewsItem from '../offer-reviews-item';
import { memo, useMemo } from 'react';
import { useAppSelector } from '@/hooks/store-hooks';
import { selectComments } from '@/store/comments/comments-slice';

function OfferReviews(): JSX.Element {
  const comments = useAppSelector(selectComments);

  const sortedComments = useMemo(
    () =>
      comments
        .toSorted(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .slice(0, MAX_COMMENTS_COUNT),
    [comments],
  );

  if (sortedComments.length === 0) {
    return (
      <h2 className="reviews__title">
        Reviews &middot;
        <span className="reviews__amount">0</span>
      </h2>
    );
  }

  return (
    <>
      <h2 className="reviews__title">
        Reviews &middot;
        <span className="reviews__amount">{comments.length}</span>
      </h2>
      <ul className="reviews__list">
        {sortedComments.map((comment, index) => (
          <MemoizedOfferReviewsItem
            key={comment.id || `comment-${index}`}
            commentItem={comment}
          />
        ))}
      </ul>
    </>
  );
}

const MemoizedOfferReviews = memo(OfferReviews);
export default MemoizedOfferReviews;
