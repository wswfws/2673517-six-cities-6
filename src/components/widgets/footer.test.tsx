import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './footer.tsx';

describe('Footer Component', () => {
  it('should render footer with logo link', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render footer with correct classes', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('footer');
    expect(footer).toHaveClass('container');
  });

  it('should render logo link with correct href', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render logo link with correct class', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('footer__logo-link');
  });

  it('should render logo image with correct attributes', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const img = screen.getByAltText('6 cities logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('footer__logo');
    expect(img).toHaveAttribute('src', '/img/logo.svg');
    expect(img).toHaveAttribute('width', '64');
    expect(img).toHaveAttribute('height', '33');
  });
});
