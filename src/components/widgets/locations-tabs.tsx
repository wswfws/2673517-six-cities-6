import React, { memo } from 'react';
import CitiesList from './cities-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';
import {STATIC_CITIES} from '../../const.ts';


function LocationsTabsComponent() {
  const {getCityPath} = useAppRoutes();

  return (
    <CitiesList cities={STATIC_CITIES} getCityPath={getCityPath}/>
  );
}

const LocationsTabs: React.NamedExoticComponent<Record<string, never>> = memo(LocationsTabsComponent);
LocationsTabs.displayName = 'LocationsTabs';

export default LocationsTabs;
