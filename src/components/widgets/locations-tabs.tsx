import CitiesList from './cities-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';
import {STATIC_CITIES} from '../../const.ts';
import {memo} from "react";


const LocationsTabs = memo(() => {
  const {getCityPath} = useAppRoutes();

  return (
    <CitiesList cities={STATIC_CITIES} getCityPath={getCityPath}/>
  );
})

export default LocationsTabs
