import {Link} from "react-router-dom";

export default function Error404Page() {
  return (
    <div
      className='page page--gray page--main'
      style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
    >
      <h1>Страница не найдена</h1>
      <Link
        className="header__nav-link header__nav-link--profile" to="/"
        style={{fontSize: 32}}
      >
        Домой
      </Link>
    </div>
  )
}
