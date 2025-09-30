import TabList, {ITabList} from '../shared/tab-list.tsx';

const locations: ITabList = [
  {
    text: 'Paris',
    href: '/Paris'
  },
  {
    text: 'Cologne',
    href: '/Cologne'
  },
  {
    text: 'Brussels',
    href: '/Brussels'
  },
  {
    text: 'Amsterdam',
    href: '/Amsterdam',
  },
  {
    text: 'Hamburg',
    href: '/Hamburg'
  },
  {
    text: 'Dusseldorf',
    href: '/Dusseldorf'
  },
];

export default function LocationsTabs() {
  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}
