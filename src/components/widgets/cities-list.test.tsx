import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CitiesList from './cities-list.tsx';

describe('CitiesList Component', () => {
  const mockCities = ['Paris', 'Amsterdam', 'Berlin'];
  const mockGetCityPath = vi.fn((city: string) => `/${city.toLowerCase()}`);

  beforeEach(() => {
    mockGetCityPath.mockClear();
  });

  it('should render section with correct classes', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    const section = document.querySelector('section');
    expect(section).toHaveClass('locations');
    expect(section).toHaveClass('container');
  });

  it('should render all cities as list items', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should render all city names', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('should call getCityPath for each city', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    expect(mockGetCityPath).toHaveBeenCalledWith('Paris');
    expect(mockGetCityPath).toHaveBeenCalledWith('Amsterdam');
    expect(mockGetCityPath).toHaveBeenCalledWith('Berlin');
    expect(mockGetCityPath).toHaveBeenCalledTimes(3);
  });

  it('should render links with correct href attributes', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/paris');
    expect(links[1]).toHaveAttribute('href', '/amsterdam');
    expect(links[2]).toHaveAttribute('href', '/berlin');
  });

  it('should render empty list when cities array is empty', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={[]} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('should render single city correctly', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={['London']} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    expect(screen.getByText('London')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
  });

  it('should render tab list component', () => {
    render(
      <BrowserRouter>
        <CitiesList cities={mockCities} getCityPath={mockGetCityPath} />
      </BrowserRouter>
    );

    const tabList = document.querySelector('.tabs__list');
    expect(tabList).toBeInTheDocument();
  });
});
