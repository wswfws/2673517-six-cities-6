import Header from '../../components/widgets/header.tsx';
import CityPlaceCard from '../../components/widgets/city-place-card.tsx';
import {useParams} from 'react-router-dom';
import Error404Page from '../404.tsx';
import ReviewList from '../../components/widgets/reviews/review-list.tsx';
import MapOffer from '../../components/shared/map-offer.tsx';
import {useAppDispatch, useAppSelector, useAuthorizationStatus} from '../../store/hooks.ts';
import {useEffect} from 'react';
import {fetchOfferAction, postFavoriteAction} from '../../store/api-actions.ts';
import {useNavigate} from 'react-router-dom';
import {ROUTE_CONFIG} from '../../components/app/use-app-routes.ts';
import {AuthorizationStatus} from '../../const.ts';

export default function OfferPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const offerId = params.id ?? '';

  const offerDetail = useAppSelector((state) => state.offers.offerDetail);
  const neighborsPlaces = useAppSelector((state) => state.offers.neighbors);
  const comments = useAppSelector((state) => state.offers.comments);
  const isLoadingOffer = useAppSelector((state) => state.offers.isLoadingOffer);
  const offerNotFound = useAppSelector((state) => state.offers.offerNotFound);

  useEffect(() => {
    if (offerId) {
      dispatch(fetchOfferAction(offerId));
    }
  }, [dispatch, offerId]);

  const authorizationStatus = useAuthorizationStatus();
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(ROUTE_CONFIG.LOGIN);
      return;
    }
    const status = offerDetail?.isFavorite ? 0 : 1;
    if (offerDetail) {
      dispatch(postFavoriteAction({offerId: offerDetail.id, status}));
    }
  };

  if (!offerId) {
    return <Error404Page/>;
  }

  if (isLoadingOffer) {
    return <div>Loading...</div>;
  }

  if (offerNotFound || !offerDetail) {
    return <Error404Page/>;
  }

  return (
    <div className='page'>
      <Header/>
      <main className='page__main page__main--offer'>
        <section className='offer'>
          <div className='offer__gallery-container container'>
            <div className='offer__gallery'>
              {(offerDetail.images ?? ['/img/room.jpg']).map((src) => (
                <div className='offer__image-wrapper' key={src}>
                  <img className='offer__image' src={src} alt='Photo studio'/>
                </div>
              ))}
            </div>
          </div>
          <div className='offer__container container'>
            <div className='offer__wrapper'>
              {offerDetail.isPremium &&
                <div className='offer__mark'>
                  <span>Premium</span>
                </div>}
              <div className='offer__name-wrapper'>
                <h1 className='offer__name'>
                  {offerDetail.title}
                </h1>
                <button className='offer__bookmark-button button' type='button' onClick={handleFavoriteClick}>
                  <svg className='offer__bookmark-icon' width='31' height='33'>
                    <use xlinkHref='#icon-bookmark'></use>
                  </svg>
                  <span className='visually-hidden'>To bookmarks</span>
                </button>
              </div>
              <div className='offer__rating rating'>
                <div className='offer__stars rating__stars'>
                  <span style={{width: `${offerDetail.rating * 20}%`}}></span>
                  <span className='visually-hidden'>Rating</span>
                </div>
                <span className='offer__rating-value rating__value'>{offerDetail.rating}</span>
              </div>
              <ul className='offer__features'>
                <li className='offer__feature offer__feature--entire'>
                  {offerDetail.type}
                </li>
                <li className='offer__feature offer__feature--bedrooms'>
                  {offerDetail.bedrooms} Bedrooms
                </li>
                <li className='offer__feature offer__feature--adults'>
                  Max {offerDetail.maxAdults} adults
                </li>
              </ul>
              <div className='offer__price'>
                <b className='offer__price-value'>&euro;{offerDetail.price}</b>
                <span className='offer__price-text'>&nbsp;night</span>
              </div>
              <div className='offer__inside'>
                <h2 className='offer__inside-title'>What&apos;s inside</h2>
                <ul className='offer__inside-list'>
                  {offerDetail.goods.map((good) => (
                    <li className='offer__inside-item' key={good}>{good}</li>
                  ))}
                </ul>
              </div>
              <div className='offer__host'>
                <h2 className='offer__host-title'>Meet the host</h2>
                <div className='offer__host-user user'>
                  <div className={`offer__avatar-wrapper ${
                    offerDetail.host.isPro ? 'offer__avatar-wrapper--pro' : 'user__avatar-wrapper'}`}
                  >
                    <img
                      className='offer__avatar user__avatar'
                      src='/img/avatar-angelina.jpg'
                      width='74' height='74'
                      alt={offerDetail.host.avatarUrl}
                    />
                  </div>
                  <span className='offer__user-name'>
                    {offerDetail.host.name}
                  </span>
                  {offerDetail.host.isPro &&
                    <span className='offer__user-status'>Pro</span>}
                </div>
                <div className='offer__description'>
                  <p className='offer__text'>
                    {offerDetail.description}
                  </p>
                </div>
              </div>
              <ReviewList reviews={comments}/>
            </div>
          </div>
          <MapOffer
            city={offerDetail.city}
            mainPoint={{id: offerDetail.id, ...offerDetail.location}}
            neighborPoint={neighborsPlaces.map((p) => ({
              id: p.id,
              longitude: p.location.longitude,
              latitude: p.location.latitude
            }))}
          />
        </section>
        <div className='container'>
          <section className='near-places places'>
            <h2 className='near-places__title'>Other places in the neighbourhood</h2>
            <div className='near-places__list places__list'>
              {neighborsPlaces.map((p) => (
                <CityPlaceCard cityPlaceInfo={p} key={p.id}/>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
