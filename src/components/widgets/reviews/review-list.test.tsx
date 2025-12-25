import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import ReviewList from './review-list.tsx';
import {AuthorizationStatus} from '../../../const.ts';
import {useAuthorizationStatus} from '../../../store/hooks.ts';

vi.mock('../../../store/hooks.ts', async () => {
  const actual: typeof import('../../../store/hooks.ts') = await vi.importActual('../../../store/hooks.ts');
  return {
    ...actual,
    useAuthorizationStatus: vi.fn(),
    useAppDispatch: vi.fn(() => vi.fn()),
    useAppSelector: vi.fn((selector: (param: object) => void) => selector?.({offers: {isPostingComment: false}})),
  };
});

const reviews = [
  {id: 'r1', comment: 'First', date: '2021-01-01', rating: 4, user: {id: 'u1', name: 'A', avatarUrl: '', isPro: false}},
  {
    id: 'r2',
    comment: 'Second',
    date: '2022-01-01',
    rating: 5,
    user: {id: 'u2', name: 'B', avatarUrl: '', isPro: false}
  },
];

describe('ReviewList', () => {
  it('renders reviews sorted by date desc and shows amount', () => {
    render(<ReviewList reviews={reviews}/>);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Second');
    expect(items[1]).toHaveTextContent('First');
  });

  it('does not show review form when not authenticated', () => {
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.NoAuth);

    render(<ReviewList reviews={reviews}/>);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows review form when authenticated', () => {
    vi.mocked(useAuthorizationStatus).mockReturnValue(AuthorizationStatus.Auth);

    render(<ReviewList reviews={reviews}/>);

    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
});
