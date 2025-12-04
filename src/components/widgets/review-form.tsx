import { useState, ChangeEvent, FormEvent } from 'react';
import {useAppDispatch, useAppSelector} from '../../store/hooks.ts';
import {useParams} from 'react-router-dom';
import {postCommentAction} from '../../store/api-actions.ts';
import {toast} from 'react-toastify';

interface ReviewFormData {
  rating: number;
  review: string;
}

export default function ReviewForm() {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    review: ''
  });

  const dispatch = useAppDispatch();
  const params = useParams();
  const offerId = params.id ?? '';
  const isPosting = useAppSelector((state) => state.offers.isPostingComment);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      rating: Number(event.target.value)
    });
  };

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      review: event.target.value
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!offerId) {
      return;
    }
    try {
      await dispatch(postCommentAction({offerId, rating: formData.rating, comment: formData.review})).unwrap();
      setFormData({rating: 0, review: ''});
    } catch (e) {
      toast.error('Failed to post review. Please try again later.');
    }
  };

  const isSubmitDisabled = formData.rating === 0 || formData.review.length < 50 || isPosting;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={(e) => void handleSubmit(e)}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          checked={formData.rating === 5}
          onChange={handleRatingChange}
        />
        <label htmlFor="5-stars" className="reviews__rating-label form__rating-label" title="perfect">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={formData.rating === 4}
          onChange={handleRatingChange}
        />
        <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={formData.rating === 3}
          onChange={handleRatingChange}
        />
        <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={formData.rating === 2}
          onChange={handleRatingChange}
        />
        <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-star"
          type="radio"
          checked={formData.rating === 1}
          onChange={handleRatingChange}
        />
        <label htmlFor="1-star" className="reviews__rating-label form__rating-label" title="terribly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleReviewChange}
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
          {isPosting ? 'Posting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
