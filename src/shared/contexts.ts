import React from 'react';
import {CityPlaceInfo} from './CityPlace';

const CityContext = React.createContext('');

const PlacesContext = React.createContext<CityPlaceInfo[]>([]);

export {CityContext, PlacesContext};
