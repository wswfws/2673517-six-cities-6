import {NavLink} from 'react-router-dom';

export type ITabList = {
  text: string;
  href: string;
}[];

const getNavLinkClassname = (isActive: boolean) => `locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`;

export default function TabList({tabs}: { tabs: ITabList }) {
  return (
    <ul className='locations__list tabs__list'>
      {tabs.map((tab) => (
        <li className='locations__item' key={tab.text}>
          <NavLink
            className={({isActive}) => getNavLinkClassname(isActive)}
            to={tab.href}
          >
            <span>{tab.text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
