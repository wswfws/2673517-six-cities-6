import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewItem from './review-item.tsx';
import type { Review } from './review-types.ts';

describe('ReviewItem Component', () => {
  const mockReview: Review = {
    id: '1',
    date: '2024-01-15',
    user: {
      name: 'John Doe',
      avatarUrl: '/img/avatar.jpg',
      isPro: true,
    },
    comment: 'This is a great place to stay!',
    rating: 4,
  };

  it('should render review item as list item', () => {
    render(<ReviewItem review={mockReview} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('reviews__item');
  });

  it('should render user name correctly', () => {
    render(<ReviewItem review={mockReview} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render user name with correct class', () => {
    render(<ReviewItem review={mockReview} />);

    const userName = screen.getByText('John Doe');
    expect(userName).toHaveClass('reviews__user-name');
  });

  it('should render user avatar with correct attributes', () => {
    render(<ReviewItem review={mockReview} />);

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/img/avatar.jpg');
    expect(avatar).toHaveAttribute('width', '54');
    expect(avatar).toHaveAttribute('height', '54');
  });

  it('should render review comment correctly', () => {
    render(<ReviewItem review={mockReview} />);

    expect(screen.getByText('This is a great place to stay!')).toBeInTheDocument();
  });

  it('should render review comment with correct class', () => {
    render(<ReviewItem review={mockReview} />);

    const comment = screen.getByText('This is a great place to stay!');
    expect(comment).toHaveClass('reviews__text');
  });

  it('should render review date with correct dateTime attribute', () => {
    render(<ReviewItem review={mockReview} />);

    const time = document.querySelector('.reviews__time') ;
    expect(time).toBeTruthy();
    expect(time).toHaveAttribute('dateTime', '2024-01-15');
  });

  it('should render review date with correct class', () => {
    render(<ReviewItem review={mockReview} />);

    const time = document.querySelector('.reviews__time');
    expect(time).toHaveClass('reviews__time');
  });

  it('should render rating span with correct width percentage for 5 stars', () => {
    const fiveStarReview: Review = { ...mockReview, rating: 5 };

    render(<ReviewItem review={fiveStarReview} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '100%' });
  });

  it('should render rating span with correct width percentage for 3 stars', () => {
    const threeStarReview: Review = { ...mockReview, rating: 3 };

    render(<ReviewItem review={threeStarReview} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '60%' });
  });

  it('should render rating span with correct width percentage for 1 star', () => {
    const oneStarReview: Review = { ...mockReview, rating: 1 };

    render(<ReviewItem review={oneStarReview} />);

    const ratingSpan = document.querySelector('.reviews__stars span');
    expect(ratingSpan).toHaveStyle({ width: '20%' });
  });

  it('should render user section with correct classes', () => {
    render(<ReviewItem review={mockReview} />);

    const userSection = document.querySelector('.reviews__user');
    expect(userSection).toHaveClass('reviews__user');
    expect(userSection).toHaveClass('user');
  });

  it('should render info section with correct classes', () => {
    render(<ReviewItem review={mockReview} />);

    const infoSection = document.querySelector('.reviews__info');
    expect(infoSection).toHaveClass('reviews__info');
  });

  it('should render rating section with correct classes', () => {
    render(<ReviewItem review={mockReview} />);

    const ratingSection = document.querySelector('.reviews__rating');
    expect(ratingSection).toHaveClass('reviews__rating');
    expect(ratingSection).toHaveClass('rating');
  });
});
