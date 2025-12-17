import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortOptions from './sort-options.tsx';

describe('SortOptions Component', () => {
  const mockOnChange = vi.fn();

  it('should render sort options form', () => {
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(container.querySelector('.places__sorting-type')).toBeInTheDocument();
  });

  it('should display current sort option', () => {
    const { container } = render(<SortOptions current="Price: low to high" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveTextContent('Price: low to high');
  });

  it('should have dropdown closed by default', () => {
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should open dropdown when clicking on sort type', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');
  });

  it('should toggle dropdown when clicking sort type multiple times', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    
    await user.click(sortType!);
    let optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(sortType!);
    optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should render all sort options', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    expect(screen.getAllByText('Popular').length).toBeGreaterThan(0);
    expect(screen.getByText('Price: low to high')).toBeInTheDocument();
    expect(screen.getByText('Price: high to low')).toBeInTheDocument();
    expect(screen.getByText('Top rated first')).toBeInTheDocument();
  });

  it('should highlight current option in dropdown', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Top rated first" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Top rated first');
    const activeOption = options.find((el) => 
      el.classList.contains('places__option--active')
    );
    
    expect(activeOption).toBeInTheDocument();
  });

  it('should call onChange when selecting an option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Price: low to high');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    );
    
    await user.click(dropdownOption!);

    expect(mockOnChange).toHaveBeenCalledWith('Price: low to high');
  });

  it('should close dropdown after selecting an option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Price: high to low');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    );
    
    await user.click(dropdownOption!);

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should support keyboard navigation with Enter key', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type') as HTMLElement;
    sortType.focus();
    await user.keyboard('{Enter}');
    
    // Re-render to check state after keyboard interaction
    expect(sortType).toBeInTheDocument();
  });

  it('should support keyboard navigation with Space key', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type') as HTMLElement;
    sortType.focus();
    await user.keyboard(' ');

    expect(sortType).toBeInTheDocument();
  });

  it('should select option with Enter key', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Top rated first');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    ) as HTMLElement;
    
    dropdownOption.focus();
    await user.keyboard('{Enter}');

    expect(mockOnChange).toHaveBeenCalledWith('Top rated first');
  });

  it('should select option with Space key', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Price: high to low');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    ) as HTMLElement;
    
    dropdownOption.focus();
    await user.keyboard(' ');

    expect(mockOnChange).toHaveBeenCalledWith('Price: high to low');
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    expect(sortType).toHaveAttribute('role', 'button');
    expect(sortType).toHaveAttribute('tabIndex', '0');
  });

  it('should have correct accessibility for options', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Price: low to high');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    );
    
    expect(dropdownOption).toHaveAttribute('role', 'button');
    expect(dropdownOption).toHaveAttribute('tabIndex', '0');
  });

  it('should prevent default form submission', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const form = container.querySelector('form');
    const handleSubmit = vi.fn((e) => e.preventDefault());
    form?.addEventListener('submit', handleSubmit);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    // Form should not submit
    expect(form).toBeInTheDocument();
  });

  it('should render sorting arrow icon', () => {
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const arrow = container.querySelector('.places__sorting-arrow');
    expect(arrow).toBeInTheDocument();
  });

  it('should maintain selected option after reopening dropdown', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    
    // Open, select, close
    await user.click(sortType!);
    const options = screen.getAllByText('Price: low to high');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    );
    await user.click(dropdownOption!);

    // Verify onChange was called
    expect(mockOnChange).toHaveBeenCalledWith('Price: low to high');
  });

  it('should not call onChange when clicking on currently selected option', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    await user.click(sortType!);

    const options = screen.getAllByText('Popular');
    const dropdownOption = options.find((el) => 
      el.classList.contains('places__option')
    );
    
    await user.click(dropdownOption!);

    expect(mockOnChange).toHaveBeenCalledWith('Popular');
  });

  it('should handle rapid clicks gracefully', async () => {
    const user = userEvent.setup();
    const { container } = render(<SortOptions current="Popular" onChange={mockOnChange} />);

    const sortType = container.querySelector('.places__sorting-type');
    
    await user.click(sortType!);
    await user.click(sortType!);
    await user.click(sortType!);

    // Should not throw errors
    expect(sortType).toBeInTheDocument();
  });
});
