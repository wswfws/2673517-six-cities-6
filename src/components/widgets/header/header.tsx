import {memo, NamedExoticComponent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ROUTE_CONFIG} from '../../app/use-app-routes.ts';
import {useAppDispatch, useAppSelector, useAuthorizationStatus} from '../../../store/hooks.ts';
import {AuthorizationStatus} from '../../../const.ts';
import {logoutAction} from '../../../store/api-actions.ts';

const HeaderNavigationAuth = () => {
  const userData = useAppSelector((state) => state.user.userData);
  const favoriteCount = useAppSelector((state) => state.offers.places.filter((p) => p.isFavorite).length);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = () => {
    setIsLoggingOut(true);
    dispatch(logoutAction()).unwrap()
      .then(() => {
        navigate(ROUTE_CONFIG.ROOT);
      })
      .finally(() => setIsLoggingOut(false));
  };

  return (
    <nav className='header__nav'>
      <ul className='header__nav-list'>
        <li className='header__nav-item user'>
          <Link className='header__nav-link header__nav-link--profile' to={ROUTE_CONFIG.FAVORITES}>
            <div className='header__avatar-wrapper user__avatar-wrapper'>
            </div>
            <span className='header__user-name user__name'>{userData?.email ?? ''}</span>
            <span className='header__favorite-count'>{favoriteCount}</span>
          </Link>
        </li>
        <li className="header__nav-item">
          {/* not React Link because not real link? but has role link to sign out  */}
          <a className='header__nav-link'
             type='button'
             onClick={handleSignOut}
             aria-busy={isLoggingOut}
          >
            <span className="header__signout">{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

function HeaderNavigation() {
  const authorizationStatus = useAuthorizationStatus();

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <HeaderNavigationAuth/>;
  }
  if (authorizationStatus === AuthorizationStatus.NoAuth) {
    return (
      <nav className='header__nav'>
        <ul className='header__nav-list'>
          <li className='header__nav-item user'>
            <Link className='header__nav-link header__nav-link--profile' to={ROUTE_CONFIG.LOGIN}>
              <div className='header__avatar-wrapper user__avatar-wrapper'>
              </div>
              <span className='header__login'>Sign in</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
  return null;
}

type HeaderProps = { showNav?: boolean };

function HeaderComponent({showNav = true}: HeaderProps) {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header__wrapper'>
          <div className='header__left'>
            <Link className='header__logo-link header__logo-link--active' to={ROUTE_CONFIG.ROOT}>
              <img className='header__logo' src='/img/logo.svg' alt='6 cities logo' width='81' height='41'/>
            </Link>
          </div>
          {showNav && <HeaderNavigation/>}
        </div>
      </div>
    </header>
  );
}

const Header: NamedExoticComponent<HeaderProps> = memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;
