import TabList, {ITabList} from '../shared/tab-list.tsx';
import useAppRoutes from '../app/use-app-routes.ts';
import {cities} from '../../api/temp-get-places.tsx';


export default function LocationsTabs() {

  const {getCityPath} = useAppRoutes();
  const locations: ITabList = cities.map((city) => ({text: city.name, href: getCityPath(city.name)}));

  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}
