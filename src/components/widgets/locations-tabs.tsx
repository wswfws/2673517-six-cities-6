import CitiesList from './cities-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';
import {STATIC_CITIES} from '../../const.ts';


export default function LocationsTabs() {
  const {getCityPath} = useAppRoutes();

  return (
    <CitiesList cities={STATIC_CITIES} getCityPath={getCityPath}/>
  );
}
