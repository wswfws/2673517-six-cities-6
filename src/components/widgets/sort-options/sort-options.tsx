import React, { memo, NamedExoticComponent, useCallback, useState } from 'react';

type SortOption = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

type Props = {
  current: SortOption;
  onChange: (option: SortOption) => void;
};

function SortOptionsComponent({current, onChange}: Props) {
  const [open, setOpen] = useState(false);
  const options: SortOption[] = ['Popular', 'Price: low to high', 'Price: high to low', 'Top rated first'];

  const handleToggle = useCallback(() => {
    setOpen((s) => !s);
  }, []);

  const handleKeyToggle = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen((s) => !s);
    }
  }, []);

  const handleOptionSelect = useCallback((opt: SortOption) => {
    onChange(opt);
    setOpen(false);
  }, [onChange]);

  const handleOptionKeySelect = useCallback((e: React.KeyboardEvent, opt: SortOption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(opt);
      setOpen(false);
    }
  }, [onChange]);

  return (
    <form className='places__sorting' action='#' method='get' onSubmit={(e) => e.preventDefault()}>
      <span className='places__sorting-caption'>Sort by</span>
      <span
        className='places__sorting-type'
        tabIndex={0}
        role='button'
        onClick={handleToggle}
        onKeyDown={handleKeyToggle}
      >
        {current}
        <svg className='places__sorting-arrow' width='7' height='4'>
          <use xlinkHref='#icon-arrow-select'></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom ${open ? 'places__options--opened' : ''}`}>
        {options.map((opt) => (
          <li
            key={opt}
            className={`places__option ${opt === current ? 'places__option--active' : ''}`}
            tabIndex={0}
            role='button'
            onClick={() => handleOptionSelect(opt)}
            onKeyDown={(e) => handleOptionKeySelect(e, opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
    </form>
  );
}

const SortOptions: NamedExoticComponent<Props> = memo(SortOptionsComponent, (prevProps, nextProps) => prevProps.current === nextProps.current);
SortOptions.displayName = 'SortOptions';

export default SortOptions;
