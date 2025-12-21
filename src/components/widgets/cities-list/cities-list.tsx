import TabList, {ITabList} from '../../shared/tab-list/tab-list.tsx';

type Props = {
  cities: string[];
  getCityPath: (city: string) => string;
};

export default function CitiesList({cities, getCityPath}: Props) {
  const locations: ITabList = cities.map((city) => ({text: city, href: getCityPath(city)}));

  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}

