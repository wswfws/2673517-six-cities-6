import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import ReviewForm from './review-form.tsx';
import {postCommentAction} from '../../../store/api-actions';
import {toast} from 'react-toastify';

// Mock dependencies
vi.mock('../../../store/api-actions', () => ({
  postCommentAction: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('./rating-group.tsx', () => ({
  default: ({value, onChange}: { value: number; onChange: (v: number) => void }) => (
    <div data-testid="rating-group">
      <button type="button" onClick={() => onChange(1)}>1 star</button>
      <button type="button" onClick={() => onChange(2)}>2 stars</button>
      <button type="button" onClick={() => onChange(3)}>3 stars</button>
      <button type="button" onClick={() => onChange(4)}>4 stars</button>
      <button type="button" onClick={() => onChange(5)}>5 stars</button>
      <span data-testid="current-rating">{value}</span>
    </div>
  ),
}));

vi.mock('./review-textarea.tsx', () => ({
  default: ({value, onChange}: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="review-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Tell about your experience"
    />
  ),
}));

vi.mock('react-router-dom', async () => {
  const actual: typeof import('react-router-dom') = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({id: 'test-offer-id'})),
  };
});

describe('ReviewForm Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        offers: () => ({isPostingComment: false}),
      },
    });
  });

  const renderWithProviders = (component: React.ReactElement) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  it('should render review form with all elements', () => {
    renderWithProviders(<ReviewForm/>);

    expect(screen.getByText('Your review')).toBeInTheDocument();
    expect(screen.getByTestId('rating-group')).toBeInTheDocument();
    expect(screen.getByTestId('review-textarea')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument();
  });

  it('should render help text with requirements', () => {
    renderWithProviders(<ReviewForm/>);

    expect(screen.getByText(/to submit review please make sure to set/i)).toBeInTheDocument();
    expect(screen.getByText('rating')).toBeInTheDocument();
    expect(screen.getByText('50 characters')).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    renderWithProviders(<ReviewForm/>);

    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when rating is set and review is long enough', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea');
    await user.type(textarea, 'A'.repeat(50));

    await waitFor(() => {
      const submitButton = screen.getByRole('button', {name: /submit/i});
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should keep submit button disabled if review is too short', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea');
    await user.type(textarea, 'Too short');

    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton).toBeDisabled();
  });

  it('should keep submit button disabled if rating is not set', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    const textarea = screen.getByTestId('review-textarea');
    await user.type(textarea, 'A'.repeat(50));

    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton).toBeDisabled();
  });

  it('should update rating when star is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('4 stars');
    await user.click(ratingButton);

    const currentRating = screen.getByTestId('current-rating');
    expect(currentRating).toHaveTextContent('4');
  });

  it('should update review text when typing in textarea', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    const textarea = screen.getByTestId('review-textarea') as HTMLTextAreaElement;
    await user.type(textarea, 'Great place to stay!');

    expect(textarea.value).toContain('Great place to stay!');
  });

  it('should call postCommentAction on form submission', async () => {
    const user = userEvent.setup();
    const mockUnwrap = vi.fn().mockResolvedValue({});
    const mockPostComment = vi.fn(() => ({
      unwrap: mockUnwrap,
    }));
    vi.mocked(postCommentAction).mockReturnValue(mockPostComment as never);

    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea');
    const reviewText = 'A'.repeat(50);
    await user.clear(textarea);
    await user.type(textarea, reviewText);

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(postCommentAction).toHaveBeenCalledWith({
        offerId: 'test-offer-id',
        rating: 5,
        comment: reviewText,
      });
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    const mockUnwrap = vi.fn().mockResolvedValue({});
    const mockPostComment = vi.fn(() => ({
      unwrap: mockUnwrap,
    }));
    vi.mocked(postCommentAction).mockReturnValue(mockPostComment as never);

    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea') as HTMLTextAreaElement;
    const reviewText = 'A'.repeat(50);
    await user.clear(textarea);
    await user.type(textarea, reviewText);

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /submit/i})).not.toBeDisabled();
    });

    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUnwrap).toHaveBeenCalled();
    });

    // Check that form is reset
    await waitFor(() => {
      const currentRating = screen.getByTestId('current-rating');
      expect(currentRating).toHaveTextContent('0');
      expect(textarea.value).toBe('');
    });
  });

  it('should show error toast on submission failure', async () => {
    const user = userEvent.setup();
    const mockPostComment = vi.fn(() => ({
      unwrap: vi.fn().mockRejectedValue(new Error('Network error')),
    }));
    vi.mocked(postCommentAction).mockReturnValue(mockPostComment as never);

    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea');
    await user.type(textarea, 'A'.repeat(50));

    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to post review. Please try again later.');
    });
  });

  it('should show "Posting..." text when submitting', async () => {
    // const user = userEvent.setup();
    const mockPostComment = vi.fn(() => ({
      unwrap: vi.fn().mockImplementation(() => new Promise(() => {
      })), // Never resolves
    }));
    vi.mocked(postCommentAction).mockReturnValue(mockPostComment as never);

    store = configureStore({
      reducer: {
        offers: () => ({isPostingComment: true}),
      },
    });

    renderWithProviders(<ReviewForm/>);

    const submitButton = screen.getByRole('button', {name: /posting/i});
    expect(submitButton).toHaveTextContent('Posting...');
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when posting', () => {
    store = configureStore({
      reducer: {
        offers: () => ({isPostingComment: true}),
      },
    });

    renderWithProviders(<ReviewForm/>);

    const submitButton = screen.getByRole('button', {name: /posting/i});
    expect(submitButton).toBeDisabled();
  });

  it('should prevent form submission if no offerId is available', async () => {
    const user = userEvent.setup();
    const {useParams} = await import('react-router-dom');
    vi.mocked(useParams).mockReturnValue({id: undefined});

    const mockPostComment = vi.fn(() => ({
      unwrap: vi.fn().mockResolvedValue({}),
    }));
    vi.mocked(postCommentAction).mockReturnValue(mockPostComment as never);

    renderWithProviders(<ReviewForm/>);

    const ratingButton = screen.getByText('5 stars');
    await user.click(ratingButton);

    const textarea = screen.getByTestId('review-textarea');
    await user.type(textarea, 'A'.repeat(50));

    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    expect(postCommentAction).not.toHaveBeenCalled();
  });

  it('should have correct form attributes', () => {
    renderWithProviders(<ReviewForm/>);

    const form = screen.getByRole('button', {name: /submit/i}).closest('form');
    expect(form).toHaveClass('reviews__form');
    expect(form).toHaveClass('form');
    expect(form).toHaveAttribute('action', '#');
    expect(form).toHaveAttribute('method', 'post');
  });

  it('should update rating multiple times', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewForm/>);

    await user.click(screen.getByText('3 stars'));
    expect(screen.getByTestId('current-rating')).toHaveTextContent('3');

    await user.click(screen.getByText('5 stars'));
    expect(screen.getByTestId('current-rating')).toHaveTextContent('5');

    await user.click(screen.getByText('2 stars'));
    expect(screen.getByTestId('current-rating')).toHaveTextContent('2');
  });
});
