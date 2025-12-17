import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import RatingInput from './rating-input.tsx';

describe('RatingInput Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render radio input with correct attributes', () => {
    render(
      <RatingInput
        value={5}
        label="5 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('radio');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'radio');
    expect(input).toHaveAttribute('name', 'rating');
    expect(input).toHaveAttribute('value', '5');
  });

  it('should render input with correct id based on value', () => {
    render(
      <RatingInput
        value={4}
        label="4 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('radio');
    expect(input).toHaveAttribute('id', '4-stars');
  });

  it('should render unchecked radio input', () => {
    render(
      <RatingInput
        value={3}
        label="3 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('radio');
    expect(input).not.toBeChecked();
  });

  it('should render checked radio input', () => {
    render(
      <RatingInput
        value={5}
        label="5 stars"
        checked
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('radio');
    expect(input).toBeChecked();
  });

  it('should render label with correct htmlFor attribute', () => {
    render(
      <RatingInput
        value={2}
        label="2 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = document.querySelector('label');
    expect(label).toHaveAttribute('for', '2-stars');
  });

  it('should render label with correct title attribute', () => {
    render(
      <RatingInput
        value={4}
        label="4 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = document.querySelector('label');
    expect(label).toHaveAttribute('title', '4 stars');
  });

  it('should render label with correct classes', () => {
    render(
      <RatingInput
        value={3}
        label="3 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const label = document.querySelector('label');
    expect(label).toHaveClass('reviews__rating-label');
    expect(label).toHaveClass('form__rating-label');
  });

  it('should render input with visually-hidden class', () => {
    render(
      <RatingInput
        value={5}
        label="5 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('radio');
    expect(input).toHaveClass('form__rating-input');
    expect(input).toHaveClass('visually-hidden');
  });

  it('should render star icon with correct attributes', () => {
    render(
      <RatingInput
        value={4}
        label="4 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '37');
    expect(svg).toHaveAttribute('height', '33');
  });

  it('should render use element with correct href', () => {
    render(
      <RatingInput
        value={5}
        label="5 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const use = document.querySelector('use');
    expect(use).toHaveAttribute('xlink:href', '#icon-star');
  });

  it('should render all rating input variants correctly', () => {
    const {rerender} = render(
      <RatingInput
        value={1}
        label="1 star"
        checked={false}
        onChange={mockOnChange}
      />
    );

    let input = screen.getByRole('radio');

    expect(input).toHaveAttribute('value', '1');
    expect(input).toHaveAttribute('id', '1-stars');

    rerender(
      <RatingInput
        value={5}
        label="5 stars"
        checked
        onChange={mockOnChange}
      />
    );

    input = screen.getByRole('radio');
    expect(input).toHaveAttribute('value', '5');
    expect(input).toHaveAttribute('id', '5-stars');
    expect(input).toBeChecked();
  });

  it('should render star image with correct class', () => {
    render(
      <RatingInput
        value={3}
        label="3 stars"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('form__star-image');
  });
});
