import {useState, FormEvent, memo, useCallback, useMemo, NamedExoticComponent} from 'react';
import {useAppDispatch, useAppSelector} from '../../../store/hooks.ts';
import {useParams} from 'react-router-dom';
import {postCommentAction} from '../../../store/api-actions.ts';
import {toast} from 'react-toastify';
import RatingGroup from './rating-group.tsx';
import ReviewTextarea from './review-textarea.tsx';

function ReviewFormComponent() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const dispatch = useAppDispatch();
  const params = useParams();
  const offerId = params.id ?? '';
  const isPosting = useAppSelector((state) => state.offers.isPostingComment);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!offerId) {
      return;
    }

    try {
      await dispatch(postCommentAction({
        offerId,
        rating,
        comment: review
      })).unwrap();

      // Сброс формы после успешной отправки
      setRating(0);
      setReview('');
    } catch (e) {
      toast.error('Failed to post review. Please try again later.');
    }
  }, [dispatch, offerId, rating, review]);

  const isSubmitDisabled = useMemo(() =>
    rating === 0 || review.length < 50 || isPosting,
  [rating, review.length, isPosting]
  );

  const buttonText = useMemo(() =>
    isPosting ? 'Posting...' : 'Submit',
  [isPosting]
  );

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={(e) => {
      void handleSubmit(e);
    }}
    >
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <RatingGroup
        value={rating}
        onChange={setRating}
      />

      <ReviewTextarea
        value={review}
        onChange={setReview}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and
          describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}

const ReviewForm: NamedExoticComponent<Record<string, never>> = memo(ReviewFormComponent);
ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;
