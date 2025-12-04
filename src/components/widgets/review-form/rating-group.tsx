import {ChangeEvent, memo, useCallback, useMemo} from 'react';
import RatingInput from './rating-input.tsx';

const RATING_OPTIONS = [
  { value: 5, label: 'perfect' },
  { value: 4, label: 'good' },
  { value: 3, label: 'not bad' },
  { value: 2, label: 'badly' },
  { value: 1, label: 'terribly' }
] as const;

interface RatingGroupProps {
  value: number;
  onChange: (value: number) => void;
}

function RatingGroup({ value, onChange }: RatingGroupProps) {
  const handleRatingChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  }, [onChange]);

  const ratingInputs = useMemo(() =>
      RATING_OPTIONS.map(({ value: optionValue, label }) => (
        <RatingInput
          key={optionValue}
          value={optionValue}
          label={label}
          checked={value === optionValue}
          onChange={handleRatingChange}
        />
      )),
    [value, handleRatingChange]
  );

  return (
    <div className="reviews__rating-form form__rating">
      {ratingInputs}
    </div>
  );
}

export default memo(
  RatingGroup,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
