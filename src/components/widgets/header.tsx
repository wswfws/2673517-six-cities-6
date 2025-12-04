import {memo, NamedExoticComponent} from 'react';
import {Link} from 'react-router-dom';
import {ROUTE_CONFIG} from '../app/use-app-routes.ts';
import {useAuthorizationStatus} from '../../store/hooks.ts';
import {AuthorizationStatus} from '../../const.ts';

function HeaderNavigation() {
  const authorizationStatus = useAuthorizationStatus();

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return (
      <nav className='header__nav'>
        <ul className='header__nav-list'>
          <li className='header__nav-item user'>
            <Link className='header__nav-link header__nav-link--profile' to='/favorites'>
              <div className='header__avatar-wrapper user__avatar-wrapper'>
              </div>
              <span className='header__user-name user__name'>Oliver.conner@gmail.com</span>
              <span className='header__favorite-count'>3</span>
            </Link>
          </li>
          <li className='header__nav-item'>
            <Link className='header__nav-link' to={ROUTE_CONFIG.LOGIN}>
              <span className='header__signout'>Sign out</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
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

function HeaderComponent() {
  return (
    <header className='header'>
      <div className='container'>
        <div className='header__wrapper'>
          <div className='header__left'>
            <Link className='header__logo-link header__logo-link--active' to={'/'}>
              <img className='header__logo' src='/img/logo.svg' alt='6 cities logo' width='81' height='41'/>
            </Link>
          </div>
          <HeaderNavigation/>
        </div>
      </div>
    </header>
  );
}

const Header: NamedExoticComponent = memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;
