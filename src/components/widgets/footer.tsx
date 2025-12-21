import {Link} from 'react-router-dom';
import {ROUTE_CONFIG} from "../app/use-app-routes.ts";

export default function Footer() {

  return (
    <footer className='footer container'>
      <Link className='footer__logo-link' to={ROUTE_CONFIG.ROOT}>
        <img className='footer__logo' src='/img/logo.svg' alt='6 cities logo' width='64' height='33'/>
      </Link>
    </footer>
  );
}
