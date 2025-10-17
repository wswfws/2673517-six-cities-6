import Header from '../../components/widgets/header.tsx';
import CityPlaceCard from '../../components/widgets/city-place-card.tsx';
import getPlaces, {getPlaceById} from '../../api/temp-get-places.tsx';
import {useParams} from 'react-router-dom';
import Error404Page from '../404.tsx';
import ReviewForm from '../../components/widgets/review-form.tsx'; // Добавлен импорт

export default function OfferPage() {

  const params = useParams();
  if (!params.id) {
    return <Error404Page/>;
  }
  const offerId = params.id ;
  const place = getPlaceById(offerId);

  if (!place) {
    return <Error404Page/>;
  }

  return (
    <div className='page'>
      <Header tempLoginStatus={'login'}/>
      <main className='page__main page__main--offer'>
        <section className='offer'>
          <div className='offer__gallery-container container'>
            <div className='offer__gallery'>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/room.jpg' alt='Photo studio'/>
              </div>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/apartment-01.jpg' alt='Photo studio'/>
              </div>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/apartment-02.jpg' alt='Photo studio'/>
              </div>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/apartment-03.jpg' alt='Photo studio'/>
              </div>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/studio-01.jpg' alt='Photo studio'/>
              </div>
              <div className='offer__image-wrapper'>
                <img className='offer__image' src='/img/apartment-01.jpg' alt='Photo studio'/>
              </div>
            </div>
          </div>
          <div className='offer__container container'>
            <div className='offer__wrapper'>
              {place.isPremium &&
                <div className='offer__mark'>
                  <span>Premium</span>
                </div>}
              <div className='offer__name-wrapper'>
                <h1 className='offer__name'>
                  {place.title}
                </h1>
                <button className='offer__bookmark-button button' type='button'>
                  <svg className='offer__bookmark-icon' width='31' height='33'>
                    <use xlinkHref='#icon-bookmark'></use>
                  </svg>
                  <span className='visually-hidden'>To bookmarks</span>
                </button>
              </div>
              <div className='offer__rating rating'>
                <div className='offer__stars rating__stars'>
                  <span style={{width: `${place.rating * 20}%`}}></span>
                  <span className='visually-hidden'>Rating</span>
                </div>
                <span className='offer__rating-value rating__value'>{place.rating}</span>
              </div>
              <ul className='offer__features'>
                <li className='offer__feature offer__feature--entire'>
                  Apartment
                </li>
                <li className='offer__feature offer__feature--bedrooms'>
                  3 Bedrooms
                </li>
                <li className='offer__feature offer__feature--adults'>
                  Max 4 adults
                </li>
              </ul>
              <div className='offer__price'>
                <b className='offer__price-value'>&euro;{place.price}</b>
                <span className='offer__price-text'>&nbsp;night</span>
              </div>
              <div className='offer__inside'>
                <h2 className='offer__inside-title'>What&apos;s inside</h2>
                <ul className='offer__inside-list'>
                  <li className='offer__inside-item'>
                    Wi-Fi
                  </li>
                  <li className='offer__inside-item'>
                    Washing machine
                  </li>
                  <li className='offer__inside-item'>
                    Towels
                  </li>
                  <li className='offer__inside-item'>
                    Heating
                  </li>
                  <li className='offer__inside-item'>
                    Coffee machine
                  </li>
                  <li className='offer__inside-item'>
                    Baby seat
                  </li>
                  <li className='offer__inside-item'>
                    Kitchen
                  </li>
                  <li className='offer__inside-item'>
                    Dishwasher
                  </li>
                  <li className='offer__inside-item'>
                    Cabel TV
                  </li>
                  <li className='offer__inside-item'>
                    Fridge
                  </li>
                </ul>
              </div>
              <div className='offer__host'>
                <h2 className='offer__host-title'>Meet the host</h2>
                <div className='offer__host-user user'>
                  <div className='offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper'>
                    <img className='offer__avatar user__avatar' src='/img/avatar-angelina.jpg' width='74' height='74'
                      alt='Host avatar'
                    />
                  </div>
                  <span className='offer__user-name'>
                    Angelina
                  </span>
                  <span className='offer__user-status'>
                    Pro
                  </span>
                </div>
                <div className='offer__description'>
                  <p className='offer__text'>
                    A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The
                    building is green and from 18th century.
                  </p>
                  <p className='offer__text'>
                    An independent House, strategically located between Rembrand Square and National Opera, but where
                    the bustle of the city comes to rest in this alley flowery and colorful.
                  </p>
                </div>
              </div>
              <section className='offer__reviews reviews'>
                <h2 className='reviews__title'>Reviews &middot; <span className='reviews__amount'>1</span></h2>
                <ul className='reviews__list'>
                  <li className='reviews__item'>
                    <div className='reviews__user user'>
                      <div className='reviews__avatar-wrapper user__avatar-wrapper'>
                        <img className='reviews__avatar user__avatar' src='/img/avatar-max.jpg' width='54' height='54'
                          alt='Reviews avatar'
                        />
                      </div>
                      <span className='reviews__user-name'>
                        Max
                      </span>
                    </div>
                    <div className='reviews__info'>
                      <div className='reviews__rating rating'>
                        <div className='reviews__stars rating__stars'>
                          <span style={{width: '80%'}}></span>
                          <span className='visually-hidden'>Rating</span>
                        </div>
                      </div>
                      <p className='reviews__text'>
                        A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.
                        The building is green and from 18th century.
                      </p>
                      <time className='reviews__time' dateTime='2019-04-24'>April 2019</time>
                    </div>
                  </li>
                </ul>
                <ReviewForm />
              </section>
            </div>
          </div>
          <section className='offer__map map'></section>
        </section>
        <div className='container'>
          <section className='near-places places'>
            <h2 className='near-places__title'>Other places in the neighbourhood</h2>
            <div className='near-places__list places__list'>
              <CityPlaceCard cityPlaceInfo={getPlaces('Amsterdam')[0]}/>
              <CityPlaceCard cityPlaceInfo={getPlaces('Amsterdam')[1]}/>
              <CityPlaceCard cityPlaceInfo={getPlaces('Amsterdam')[2]}/>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
