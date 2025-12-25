import {fireEvent, render, screen} from '@testing-library/react';
import MemoReviewTextarea from './review-textarea';
import {vi} from 'vitest';

describe('ReviewTextarea', () => {
  it('renders with provided value and calls onChange when user types', () => {
    const onChange = vi.fn();

    render(<MemoReviewTextarea value="initial" onChange={onChange}/>);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect((textarea as HTMLTextAreaElement).value).toBe('initial');

    // Use a single change event for determinism
    fireEvent.change(textarea, {target: {value: 'Hello123'}});

    // onChange should be called at least once
    expect(onChange).toHaveBeenCalled();

    const lastCallArg = (onChange.mock.calls[onChange.mock.calls.length - 1] as string[])[0];
    expect(lastCallArg).toBe('Hello123');
  });
});
