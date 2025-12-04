import {ChangeEvent, memo, NamedExoticComponent} from 'react';

interface RatingInputProps {
  value: number;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function RatingInput({value, label, checked, onChange}: RatingInputProps) {
  const id = `${value}-stars`;

  return (
    <>
      <input
        className="form__rating-input visually-hidden"
        name="rating"
        value={value}
        id={id}
        type="radio"
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="reviews__rating-label form__rating-label" title={label}>
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </>
  );
}

const MemoRatingInput: NamedExoticComponent<RatingInputProps> = memo(RatingInput);
MemoRatingInput.displayName = 'RatingInput';

export default MemoRatingInput;
