import TabList, {ITabList} from '../shared/tab-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';
import {getCities} from '../../api/temp-get-places.tsx';

const cities = getCities();

export default function LocationsTabs() {

  const {getCityPath} = useAppRoutes();
  const locations: ITabList = cities.map((city) => ({text: city, href: getCityPath(city)}));

  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}
