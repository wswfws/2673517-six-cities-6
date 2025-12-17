import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TabList, { ITabList } from './tab-list.tsx';

describe('TabList Component', () => {
  const mockTabs: ITabList = [
    { text: 'Paris', href: '/paris' },
    { text: 'Amsterdam', href: '/amsterdam' },
    { text: 'Berlin', href: '/berlin' },
  ];

  it('should render tab list with correct class', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    const ul = screen.getByRole('list');
    expect(ul).toHaveClass('locations__list');
    expect(ul).toHaveClass('tabs__list');
  });

  it('should render all tabs as list items', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should render each list item with correct class', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    const listItems = screen.getAllByRole('listitem');
    listItems.forEach((item) => {
      expect(item).toHaveClass('locations__item');
    });
  });

  it('should render all tab links with correct href attributes', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', '/paris');
    expect(links[1]).toHaveAttribute('href', '/amsterdam');
    expect(links[2]).toHaveAttribute('href', '/berlin');
  });

  it('should render all tab links with correct text content', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('should render tabs with correct classes', () => {
    render(
      <BrowserRouter>
        <TabList tabs={mockTabs} />
      </BrowserRouter>
    );

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('tabs__item');
      expect(link).toHaveClass('locations__item-link');
    });
  });

  it('should render empty list when tabs are empty', () => {
    render(
      <BrowserRouter>
        <TabList tabs={[]} />
      </BrowserRouter>
    );

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('should render single tab correctly', () => {
    const singleTab: ITabList = [{ text: 'London', href: '/london' }];

    render(
      <BrowserRouter>
        <TabList tabs={singleTab} />
      </BrowserRouter>
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(screen.getByText('London')).toBeInTheDocument();
  });
});
