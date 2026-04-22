import { RequestStatus } from '@/const';
import { UserComments } from '@/types/user-comment';
import { selectComments, selectCommentsStatus } from './comments-slice';

describe('Comments selectors', () => {
  const comments: UserComments = [
    {
      id: '1',
      date: '2024-01-01T12:00:00.000Z',
      user: {
        name: 'John',
        avatarUrl: 'img/avatar-john.jpg',
        isPro: false,
      },
      comment: 'Great place!',
      rating: 5,
    },
  ];

  const state = {
    comments: {
      comments,
      status: RequestStatus.Success,
    },
  };

  it('should return comments from state', () => {
    const { comments: expectedComments } = state.comments;
    const result = selectComments(state);

    expect(result).toBe(expectedComments);
  });

  it('should return comments status from state', () => {
    const { status } = state.comments;
    const result = selectCommentsStatus(state);

    expect(result).toBe(status);
  });
});
