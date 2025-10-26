import ReviewForm from '../review-form.tsx';
import {Review} from './review-types.ts';
import ReviewItem from './review-item.tsx';

export default function ReviewList({reviews}: { reviews: Review[] }) {
  return (
    <section className='offer__reviews reviews'>
      <h2 className='reviews__title'>Reviews &middot; <span className='reviews__amount'>{reviews.length}</span></h2>
      <ul className='reviews__list'>
        {reviews.map((review) => (
          <ReviewItem review={review} key={review.id}/>
        ))}
      </ul>
      <ReviewForm/>
    </section>
  );
}
