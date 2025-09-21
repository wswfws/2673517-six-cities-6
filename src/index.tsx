import React from 'react';
import ReactDOM from 'react-dom/client';
import MainPage from './pages/main/page.tsx';
import {CityContext, PlacesContext} from './shared/contexts.ts';
import getPlaces from "./api/tempGetPlaces.tsx";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <CityContext.Provider value={"Amsterdam"}>
      <PlacesContext.Provider value={getPlaces()}>
        <MainPage/>
      </PlacesContext.Provider>
    </CityContext.Provider>
  </React.StrictMode>
);
