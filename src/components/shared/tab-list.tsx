export type ITabList = {
  text: string;
  href: string;
  isSelected?: boolean;
}[];

export default function TabList({tabs}: { tabs: ITabList }) {
  return (
    <ul className='locations__list tabs__list'>
      {tabs.map((tab) => (
        <li className='locations__item' key={tab.text}>
          <a
            className={`locations__item-link tabs__item ${tab.isSelected ? 'tabs__item--active' : ''}`}
            href={tab.href}
          >
            <span>{tab.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
