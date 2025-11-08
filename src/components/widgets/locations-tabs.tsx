import CitiesList from './cities-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';

// Статический список городов согласно ТЗ
const STATIC_CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

export default function LocationsTabs() {
  const {getCityPath} = useAppRoutes();

  return (
    <CitiesList cities={STATIC_CITIES} getCityPath={getCityPath}/>
  );
}
