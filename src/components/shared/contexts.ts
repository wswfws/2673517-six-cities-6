import React from 'react';
import {CityPlaceInfo} from './city-place';

const CityContext = React.createContext('');

const PlacesContext = React.createContext<CityPlaceInfo[]>([]);

export {CityContext, PlacesContext};
