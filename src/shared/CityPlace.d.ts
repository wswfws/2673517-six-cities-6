import {ReactNode} from 'react';

enum CityPlace {
  'Apartment',
  'Room',
}

type CityPlaceInfo = {
  id: string;
  title: ReactNode;
  imageHref: string;
  price: number;
  type: keyof typeof CityPlace;
  rating: number; // 0-100
  bookmark: boolean;
  mark?: string;
}
