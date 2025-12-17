import { describe, expect, it } from 'vitest';
import {renderHook} from '@testing-library/react';
import useSorterPlaces, { type SortOption } from './use-sorter-places';

describe('useSorterPlaces', () => {
  interface TestPlace {
    id: string;
    price?: number | string;
    rating?: number | string;
    title: string;
  }

  const mockPlaces: TestPlace[] = [
    { id: '1', title: 'Place 1', price: 100, rating: 3 },
    { id: '2', title: 'Place 2', price: 150, rating: 5 },
    { id: '3', title: 'Place 3', price: 120, rating: 4 },
    { id: '4', title: 'Place 4', price: 200, rating: 2 },
  ];

  it('should return empty array when places is undefined', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(undefined, 'Popular')
    );

    expect(result.current).toEqual([]);
  });

  it('should return empty array when places is empty', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>([], 'Popular')
    );

    expect(result.current).toEqual([]);
  });

  it('should return places in original order for "Popular" sort type', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(mockPlaces, 'Popular')
    );

    expect(result.current).toEqual(mockPlaces);
    expect(result.current[0].id).toBe('1');
    expect(result.current[1].id).toBe('2');
  });

  it('should sort places by price low to high', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(mockPlaces, 'Price: low to high')
    );

    expect(result.current[0].id).toBe('1'); // 100
    expect(result.current[1].id).toBe('3'); // 120
    expect(result.current[2].id).toBe('2'); // 150
    expect(result.current[3].id).toBe('4'); // 200
  });

  it('should sort places by price high to low', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(mockPlaces, 'Price: high to low')
    );

    expect(result.current[0].id).toBe('4'); // 200
    expect(result.current[1].id).toBe('2'); // 150
    expect(result.current[2].id).toBe('3'); // 120
    expect(result.current[3].id).toBe('1'); // 100
  });

  it('should sort places by rating high to low', () => {
    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(mockPlaces, 'Top rated first')
    );

    expect(result.current[0].id).toBe('2'); // rating 5
    expect(result.current[1].id).toBe('3'); // rating 4
    expect(result.current[2].id).toBe('1'); // rating 3
    expect(result.current[3].id).toBe('4'); // rating 2
  });

  it('should handle places with string prices', () => {
    const placesWithStringPrices: TestPlace[] = [
      { id: '1', title: 'Place 1', price: '100', rating: 3 },
      { id: '2', title: 'Place 2', price: '150', rating: 5 },
      { id: '3', title: 'Place 3', price: '120', rating: 4 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithStringPrices, 'Price: low to high')
    );

    expect(result.current[0].id).toBe('1'); // 100
    expect(result.current[1].id).toBe('3'); // 120
    expect(result.current[2].id).toBe('2'); // 150
  });

  it('should handle places with missing price', () => {
    const placesWithMissingPrice: TestPlace[] = [
      { id: '1', title: 'Place 1', price: 100, rating: 3 },
      { id: '2', title: 'Place 2', rating: 5 },
      { id: '3', title: 'Place 3', price: 120, rating: 4 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithMissingPrice, 'Price: low to high')
    );

    // Missing price should be treated as 0
    expect(result.current[0].id).toBe('2'); // 0
    expect(result.current[1].id).toBe('1'); // 100
    expect(result.current[2].id).toBe('3'); // 120
  });

  it('should handle places with missing rating', () => {
    const placesWithMissingRating: TestPlace[] = [
      { id: '1', title: 'Place 1', price: 100, rating: 3 },
      { id: '2', title: 'Place 2', price: 150 },
      { id: '3', title: 'Place 3', price: 120, rating: 4 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithMissingRating, 'Top rated first')
    );

    // Missing rating should be treated as 0
    expect(result.current[0].id).toBe('3'); // rating 4
    expect(result.current[1].id).toBe('1'); // rating 3
    expect(result.current[2].id).toBe('2'); // rating 0
  });

  it('should not mutate original places array', () => {
    const placesCopy = [...mockPlaces];

    renderHook(() =>
      useSorterPlaces<TestPlace>(mockPlaces, 'Price: low to high')
    );

    expect(mockPlaces).toEqual(placesCopy);
  });

  it('should return same reference for Popular sort type', () => {
    const { result, rerender } = renderHook(
      ({ places, sortType }: { places: TestPlace[]; sortType: SortOption }) =>
        useSorterPlaces<TestPlace>(places, sortType),
      {
        initialProps: { places: mockPlaces, sortType: 'Popular' as SortOption },
      }
    );

    const firstResult = result.current;

    rerender({ places: mockPlaces, sortType: 'Popular' });

    expect(result.current).toEqual(firstResult);
  });

  it('should update sorted places when sort type changes', () => {
    const { result, rerender } = renderHook(
      ({ places, sortType }: { places: TestPlace[]; sortType: SortOption }) =>
        useSorterPlaces<TestPlace>(places, sortType),
      {
        initialProps: { places: mockPlaces, sortType: 'Popular' as SortOption },
      }
    );

    expect(result.current[0].id).toBe('1');

    rerender({
      places: mockPlaces,
      sortType: 'Price: high to low' as SortOption,
    });

    expect(result.current[0].id).toBe('4');
  });

  it('should update sorted places when places change', () => {
    const newPlaces: TestPlace[] = [
      { id: '5', title: 'Place 5', price: 50, rating: 1 },
      { id: '6', title: 'Place 6', price: 250, rating: 5 },
    ];

    const { result, rerender } = renderHook(
      ({ places, sortType }: { places: TestPlace[]; sortType: SortOption }) =>
        useSorterPlaces<TestPlace>(places, sortType),
      {
        initialProps: { places: mockPlaces, sortType: 'Price: low to high' as SortOption },
      }
    );

    expect(result.current).toEqual(mockPlaces.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)));

    rerender({ places: newPlaces, sortType: 'Price: low to high' as SortOption });

    expect(result.current).toEqual(newPlaces.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)));
    expect(result.current[0].id).toBe('5');
    expect(result.current[1].id).toBe('6');
  });

  it('should handle ties in price sorting by maintaining original order', () => {
    const placesWithSamePrices: TestPlace[] = [
      { id: '1', title: 'Place 1', price: 100, rating: 3 },
      { id: '2', title: 'Place 2', price: 100, rating: 5 },
      { id: '3', title: 'Place 3', price: 100, rating: 4 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithSamePrices, 'Price: low to high')
    );

    // All have same price, so original order should be maintained
    expect(result.current.map((p) => p.id)).toEqual(['1', '2', '3']);
  });

  it('should handle ties in rating sorting by maintaining original order', () => {
    const placesWithSameRatings: TestPlace[] = [
      { id: '1', title: 'Place 1', price: 100, rating: 5 },
      { id: '2', title: 'Place 2', price: 150, rating: 5 },
      { id: '3', title: 'Place 3', price: 120, rating: 5 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithSameRatings, 'Top rated first')
    );

    // All have same rating, so original order should be maintained
    expect(result.current.map((p) => p.id)).toEqual(['1', '2', '3']);
  });

  it('should handle negative prices correctly', () => {
    const placesWithNegativePrices: TestPlace[] = [
      { id: '1', title: 'Place 1', price: -10, rating: 3 },
      { id: '2', title: 'Place 2', price: 100, rating: 5 },
      { id: '3', title: 'Place 3', price: 0, rating: 4 },
    ];

    const { result } = renderHook(() =>
      useSorterPlaces<TestPlace>(placesWithNegativePrices, 'Price: low to high')
    );

    expect(result.current[0].id).toBe('1'); // -10
    expect(result.current[1].id).toBe('3'); // 0
    expect(result.current[2].id).toBe('2'); // 100
  });
});
