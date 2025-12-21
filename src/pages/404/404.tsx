import {Link} from 'react-router-dom';
import {ROUTE_CONFIG} from '../../components/app/use-app-routes.ts';

export default function Error404Page() {
  return (
    <div
      className='page page--gray page--main'
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
    >
      <h1>Страница не найдена</h1>
      <Link
        className='header__nav-link header__nav-link--profile' to={ROUTE_CONFIG.ROOT}
        style={{fontSize: 32}}
      >
        Домой
      </Link>
    </div>
  );
}
