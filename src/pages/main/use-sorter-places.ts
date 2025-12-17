import {useMemo} from "react";

export type SortOption = 'Popular' | 'Price: low to high' | 'Price: high to low' | 'Top rated first';

export default function useSorterPlaces<T extends { price?: number | string; rating?: number | string }>(
  places: T[] | undefined,
  sortType: SortOption
): T[] {
  return useMemo(() => {
    if (!places) {
      return [];
    }

    const placesCopy = [...places];

    switch (sortType) {
      case 'Price: low to high':
        return placesCopy.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
      case 'Price: high to low':
        return placesCopy.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
      case 'Top rated first':
        return placesCopy.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
      case 'Popular':
      default:
        return placesCopy;
    }
  }, [places, sortType]);
}
