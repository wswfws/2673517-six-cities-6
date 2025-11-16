import {useEffect, useMemo, useRef} from 'react';

export type SortOption = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

export default function useSorterPlaces<T extends { price?: number | string; rating?: number | string }>(
  places: T[] | undefined,
  sortType: SortOption
): T[] {
  const originalRef = useRef<T[] | null>(null);

  useEffect(() => {
    originalRef.current = places ? [...places] : [];
  }, [places]);

  return useMemo(() => {
    if (!places) return [];

    if (sortType === 'Popular') {
      return originalRef.current ? [...originalRef.current] : [...places];
    }

    const list = [...(originalRef.current ?? places)];

    if (sortType === 'Price: low to high') {
      list.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sortType === 'Price: high to low') {
      list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } else if (sortType === 'Top rated first') {
      list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    }

    return list;
  }, [places, sortType]);
}
