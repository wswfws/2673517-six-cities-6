import CityPlaceCard from '../widgets/CityPlaceCard.tsx';
import {CityPlaceInfo} from '../../shared/CityPlace';
import Header from '../widgets/Header.tsx';

const places: CityPlaceInfo[] = [
  {
    id: '1',
    type: 'Apartment',
    title: <>Beautiful &amp; luxurious apartment at great location</>,
    imageHref: 'img/apartment-01.jpg',
    price: 80,
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

export default function MainPage() {
  return (
    <div className='page page--gray page--main'>
      <Header/>

      <main className='page__main page__main--index'>
        <h1 className='visually-hidden'>Cities</h1>
        <div className='tabs'>
          <section className='locations container'>
            <ul className='locations__list tabs__list'>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item' href='#'>
                  <span>Paris</span>
                </a>
              </li>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item' href='#'>
                  <span>Cologne</span>
                </a>
              </li>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item' href='#'>
                  <span>Brussels</span>
                </a>
              </li>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item tabs__item--active'>
                  <span>Amsterdam</span>
                </a>
              </li>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item' href='#'>
                  <span>Hamburg</span>
                </a>
              </li>
              <li className='locations__item'>
                <a className='locations__item-link tabs__item' href='#'>
                  <span>Dusseldorf</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className='cities'>
          <div className='cities__places-container container'>
            <section className='cities__places places'>
              <h2 className='visually-hidden'>Places</h2>
              <b className='places__found'>312 places to stay in Amsterdam</b>
              <form className='places__sorting' action='#' method='get'>
                <span className='places__sorting-caption'>Sort by</span>
                <span className='places__sorting-type' tabIndex={0}>
                  Popular
                  <svg className='places__sorting-arrow' width='7' height='4'>
                    <use xlinkHref='#icon-arrow-select'></use>
                  </svg>
                </span>
                <ul className='places__options places__options--custom places__options--opened'>
                  <li className='places__option places__option--active' tabIndex={0}>Popular</li>
                  <li className='places__option' tabIndex={0}>Price: low to high</li>
                  <li className='places__option' tabIndex={0}>Price: high to low</li>
                  <li className='places__option' tabIndex={0}>Top rated first</li>
                </ul>
              </form>
              <div className='cities__places-list places__list tabs__content'>

                {places.map((place) => (
                  <CityPlaceCard {...place} key={place.id}/>
                ))}

              </div>
            </section>
            <div className='cities__right-section'>
              <section className='cities__map map'></section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
