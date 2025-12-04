import {ChangeEvent, memo, useCallback} from 'react';

interface ReviewTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

function ReviewTextarea({value, onChange}: ReviewTextareaProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <textarea
      className="reviews__textarea form__textarea"
      id="review"
      name="review"
      placeholder="Tell how was your stay, what you like and what can be improved"
      value={value}
      onChange={handleChange}
    />
  );
}

export default memo(
  ReviewTextarea,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
