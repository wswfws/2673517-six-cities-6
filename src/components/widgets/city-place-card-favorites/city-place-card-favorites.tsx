import {CityPlaceInfo} from '../../shared/city-place/city-place.ts';
import useHandleFavoriteClick from '../../hooks/use-handle-favorite-click/use-handle-favorite-click.ts';
import useAppRoutes from '../../app/use-app-routes.ts';
import { Link } from 'react-router-dom';

export default function CityPlaceCardFavorites({cityPlaceInfo}: {
  cityPlaceInfo: CityPlaceInfo;
}) {

  const {getOfferPath} = useAppRoutes();
  const handleFavoriteClick = useHandleFavoriteClick(cityPlaceInfo);

  return (
    <article className='favorites__card place-card'>
      {cityPlaceInfo.isPremium &&
        <div className='place-card__mark'>
          <span>Premium</span>
        </div>}
      <div className='favorites__image-wrapper place-card__image-wrapper'>
        <Link to={getOfferPath(cityPlaceInfo.id)}>
          <img className='place-card__image' src={cityPlaceInfo.previewImage} width='260' height='200'
            alt='Place image'
          />
        </Link>
      </div>
      <div className='favorites__card-info place-card__info'>
        <div className='place-card__price-wrapper'>
          <div className='place-card__price'>
            <b className='place-card__price-value'>&euro;{cityPlaceInfo.price} </b>
            <span className='place-card__price-text'>&#47;&nbsp;night</span>
          </div>
          <button
            type='button'
            onClick={handleFavoriteClick}
            className={`place-card__bookmark-button ${cityPlaceInfo.isFavorite ? 'place-card__bookmark-button--active' : ''} button`}
          >
            <svg className='place-card__bookmark-icon' width='18' height='19'>
              <use xlinkHref='#icon-bookmark'></use>
            </svg>
            <span className='visually-hidden'>In bookmarks</span>
          </button>
        </div>
        <div className='place-card__rating rating'>
          <div className='place-card__stars rating__stars'>
            <span style={{width: `${Math.round(cityPlaceInfo.rating) * 20}%`}}></span>
            <span className='visually-hidden'>Rating</span>
          </div>
        </div>
        <h2 className='place-card__name'>
          <Link to={getOfferPath(cityPlaceInfo.id)}>{cityPlaceInfo.title}</Link>
        </h2>
        <p className='place-card__type'>{cityPlaceInfo.type}</p>
      </div>
    </article>
  );
}
