import {memo, NamedExoticComponent, useMemo} from 'react';
import ReviewForm from '../review-form';
import {Review} from './review-types.ts';
import ReviewItem from './review-item.tsx';
import {useAuthorizationStatus} from '../../../store/hooks.ts';
import {AuthorizationStatus} from '../../../const.ts';

function ReviewsContentComponent({reviews}: { reviews: Review[] }) {
  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [reviews]
  );

  return (
    <>
      <h2 className='reviews__title'>
        Reviews &middot; <span className='reviews__amount'>{reviews.length}</span>
      </h2>
      <ul className='reviews__list'>
        {sortedReviews.slice(0, 10).map((review) => (
          <ReviewItem review={review} key={review.id}/>
        ))}
      </ul>
    </>
  );
}

const ReviewsContent: NamedExoticComponent<{
  reviews: Review[];
}> = memo(ReviewsContentComponent, (prevProps, nextProps) => {
  if (prevProps.reviews.length !== nextProps.reviews.length) {
    return false;
  }

  return prevProps.reviews.every((review, index) =>
    review.id === nextProps.reviews[index].id
  );
});
ReviewsContent.displayName = 'ReviewsContent';

function AuthReviewFormComponent() {
  const authorizationStatus = useAuthorizationStatus();

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <ReviewForm/>;
  }

  return null;
}

const AuthReviewForm: NamedExoticComponent<Record<string, never>> = memo(AuthReviewFormComponent);
AuthReviewForm.displayName = 'AuthReviewForm';

function ReviewListComponent({reviews}: { reviews: Review[] }) {
  const reviewsContent = useMemo(
    () => <ReviewsContent reviews={reviews}/>,
    [reviews]
  );

  return (
    <section className='offer__reviews reviews'>
      {reviewsContent}
      <AuthReviewForm/>
    </section>
  );
}

const ReviewList: NamedExoticComponent<{ reviews: Review[] }> = memo(ReviewListComponent, (prevProps, nextProps) => {
  if (prevProps.reviews.length !== nextProps.reviews.length) {
    return false;
  }

  return prevProps.reviews.every((review, index) =>
    review.id === nextProps.reviews[index].id
  );
});
ReviewList.displayName = 'ReviewList';

export default ReviewList;
