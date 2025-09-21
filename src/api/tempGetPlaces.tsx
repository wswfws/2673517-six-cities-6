import {CityPlaceInfo} from "../shared/CityPlace";

const places: CityPlaceInfo[] = [
  {
    id: '1',
    type: 'Apartment',
    title: <>Beautiful &amp; luxurious apartment at great location</>,
    imageHref: 'img/apartment-01.jpg',
    price: 120,
    rating: 80,
    bookmark: false,
    mark: 'Premium',
  },
  {
    id: '2',
    type: 'Room',
    title: 'Wood and stone place',
    imageHref: 'img/room.jpg',
    price: 80,
    rating: 80,
    bookmark: true
  },
  {
    id: '3',
    type: 'Apartment',
    title: 'Canal View Prinsengracht',
    imageHref: 'img/apartment-02.jpg',
    price: 132,
    rating: 80,
    bookmark: false,
  },
  {
    id: '4',
    type: 'Apartment',
    title: 'Nice, cozy, warm big bed apartment',
    imageHref: 'img/apartment-03.jpg',
    price: 180,
    rating: 100,
    bookmark: false,
    mark: 'Premium',
  },
  {
    id: '5',
    type: 'Room',
    title: 'Wood and stone place',
    imageHref: 'img/room.jpg',
    price: 80,
    rating: 80,
    bookmark: true
  },
];

const getPlaces = (): CityPlaceInfo[] => places;

export default getPlaces;
