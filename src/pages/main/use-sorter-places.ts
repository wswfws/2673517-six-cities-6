import { useEffect, useState } from 'react';

export type SortOption = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

export default function useSorterPlaces<T extends { price?: number | string; rating?: number | string }>(
  places: T[] | undefined,
  sortType: SortOption
): T[] {
  const [sortedPlaces, setSortedPlaces] = useState<T[]>([]);

  useEffect(() => {
    if (!places) {
      setSortedPlaces([]);
      return;
    }

    let sorted: T[];

    if (sortType === 'Popular') {
      sorted = [...places];
    } else if (sortType === 'Price: low to high') {
      sorted = [...places].sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sortType === 'Price: high to low') {
      sorted = [...places].sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } else if (sortType === 'Top rated first') {
      sorted = [...places].sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    } else {
      sorted = [...places];
    }

    setSortedPlaces(sorted);
  }, [places, sortType]);

  return sortedPlaces;
}
