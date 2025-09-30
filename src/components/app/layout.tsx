import Header from "../widgets/header.tsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header isLogin/>
      <Outlet/>
      <footer className='footer container'>
        <a className='footer__logo-link' href='/'>
          <img className='footer__logo' src='/img/logo.svg' alt='6 cities logo' width='64' height='33'/>
        </a>
      </footer>
    </>
  )
}
