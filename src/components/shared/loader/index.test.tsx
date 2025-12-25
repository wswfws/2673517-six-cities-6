import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import SimpleLoader from './index.tsx';

describe('SimpleLoader', () => {
  it('renders with given width and height styles', () => {
    const {container} = render(<SimpleLoader width={10} height={20}/>);
    const el = container.querySelector('.SimpleLoader') as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle({width: '10px', height: '20px'});
  });
});
