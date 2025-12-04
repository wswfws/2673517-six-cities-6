import ReviewForm from '../review-form.tsx';
import {Review} from './review-types.ts';
import ReviewItem from './review-item.tsx';
import {useAuthorizationStatus} from '../../../store/hooks.ts';
import {AuthorizationStatus} from '../../../const.ts';

export default function ReviewList({reviews}: { reviews: Review[] }) {
  const authorizationStatus = useAuthorizationStatus();

  return (
    <section className='offer__reviews reviews'>
      <h2 className='reviews__title'>Reviews &middot; <span className='reviews__amount'>{reviews.length}</span></h2>
      <ul className='reviews__list'>
        {reviews.map((review) => (
          <ReviewItem review={review} key={review.id}/>
        ))}
      </ul>
      {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm/>}
    </section>
  );
}
