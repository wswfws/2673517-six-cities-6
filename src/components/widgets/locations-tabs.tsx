import TabList, {ITabList} from '../shared/tab-list.tsx';

const locations: ITabList = [
  {
    text: 'Paris',
    href: '#'
  },
  {
    text: 'Cologne',
    href: '#'
  },
  {
    text: 'Brussels',
    href: '#'
  },
  {
    text: 'Amsterdam',
    href: '#'
  },
  {
    text: 'Hamburg',
    href: '#'
  },
  {
    text: 'Dusseldorf',
    href: '#',
    isSelected: true
  },
];

export default function LocationsTabs() {
  return (
    <section className='locations container'>
      <TabList tabs={locations}/>
    </section>
  );
}
