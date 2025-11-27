import {useState} from 'react';

type SortOption = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

type Props = {
  current: SortOption;
  onChange: (option: SortOption) => void;
};

export default function SortOptions({current, onChange}: Props) {
  const [open, setOpen] = useState(false);
  const options: SortOption[] = ['Popular', 'Price: low to high', 'Price: high to low', 'Top rated first'];

  return (
    <form className='places__sorting' action='#' method='get' onSubmit={(e) => e.preventDefault()}>
      <span className='places__sorting-caption'>Sort by</span>
      <span
        className='places__sorting-type'
        tabIndex={0}
        role='button'
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setOpen((s) => !s);
          }
        }}
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
            onClick={() => {
              onChange(opt);
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onChange(opt);
                setOpen(false);
              }
            }}
          >
            {opt}
          </li>
        ))}
      </ul>
    </form>
  );
}
