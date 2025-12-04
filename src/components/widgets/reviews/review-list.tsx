import { memo, useMemo } from 'react';
import ReviewForm from '../review-form';
import {Review} from './review-types.ts';
import ReviewItem from './review-item.tsx';
import {useAuthorizationStatus} from '../../../store/hooks.ts';
import {AuthorizationStatus} from '../../../const.ts';

const ReviewsContent = memo(({ reviews }: { reviews: Review[] }) => {
  return (
    <>
      <h2 className='reviews__title'>
        Reviews &middot; <span className='reviews__amount'>{reviews.length}</span>
      </h2>
      <ul className='reviews__list'>
        {reviews.map((review) => (
          <ReviewItem review={review} key={review.id}/>
        ))}
      </ul>
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.reviews.length !== nextProps.reviews.length) {
    return false;
  }

  return prevProps.reviews.every((review, index) =>
    review.id === nextProps.reviews[index].id
  );
});

const AuthReviewForm = memo(() => {
  const authorizationStatus = useAuthorizationStatus();

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <ReviewForm/>;
  }

  return null;
});

function ReviewList({reviews}: { reviews: Review[] }) {
  const reviewsContent = useMemo(
    () => <ReviewsContent reviews={reviews} />,
    [reviews]
  );

  return (
    <section className='offer__reviews reviews'>
      {reviewsContent}
      <AuthReviewForm/>
    </section>
  );
}

export default memo(ReviewList, (prevProps, nextProps) => {
  if (prevProps.reviews.length !== nextProps.reviews.length) {
    return false;
  }

  return prevProps.reviews.every((review, index) =>
    review.id === nextProps.reviews[index].id
  );
});
