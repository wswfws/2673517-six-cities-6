import TabList, {ITabList} from '../../shared/tab-list/tab-list.tsx';

export type CitiesListProps = {
  cities: string[];
  getCityPath: (city: string) => string;
};

export default function CitiesList({cities, getCityPath}: CitiesListProps) {
  const locations: ITabList = cities.map((city) => ({text: city, href: getCityPath(city)}));

  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}

