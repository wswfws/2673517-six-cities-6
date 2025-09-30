import MainPage from "../../pages/main/main.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import FavoritesPage from "../../pages/favorites/favorites.tsx";
import LoginPage from "../../pages/login/login.tsx";
import OfferPage from "../../pages/offer/offer.tsx";
import Error404Page from "../../pages/404.tsx";
import PrivateRoute from "./private-route.tsx";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<Navigate to="/Amsterdam"/>}/>
          <Route path=':city' element={<MainPage/>}/>
          <Route path="favorites" element={
            <PrivateRoute>
              <FavoritesPage/>
            </PrivateRoute>
          }/>
          <Route path="login" element={<LoginPage/>}/>
          <Route path="offer/:id" element={<OfferPage/>}/>
        </Route>
        <Route path="*" element={<Error404Page/>}/>
      </Routes>
    </BrowserRouter>
  )
}
