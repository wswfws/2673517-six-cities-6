import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import Error404Page from './404';

describe('Error404Page', () => {
  it('renders heading and home link', () => {
    render(
      <BrowserRouter>
        <Error404Page />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', {name: /страница не найдена/i})).toBeInTheDocument();
    const link = screen.getByRole('link', {name: /домой/i});
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')?.endsWith('/')).toBeTruthy();
  });
});

