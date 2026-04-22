import { RequestStatus } from '@/const';
import {
  commentsSlice,
  selectComments,
  selectCommentsStatus,
} from './comments-slice';
import { fetchComments, postComment } from '../thunk/offer';

describe('Comments Slice', () => {
  const mockComment = {
    id: '1',
    date: '2023-10-10',
    user: {
      name: 'Jack',
      avatarUrl: 'img/1.png',
      isPro: false,
    },
    comment: 'Great place!',
    rating: 5,
  };

  const offerId = 'offer-123';
  const requestId = 'request-123';

  const rootState = {
    comments: {
      comments: [mockComment],
      status: RequestStatus.Success,
    },
  };

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const result = commentsSlice.reducer(undefined, emptyAction);

    expect(result).toEqual({
      comments: [],
      status: RequestStatus.Idle,
    });
  });

  it('should clear comments and reset status with "clear" action', () => {
    const initialState = {
      comments: [mockComment],
      status: RequestStatus.Success,
    };

    const result = commentsSlice.reducer(
      initialState,
      commentsSlice.actions.clear(),
    );

    expect(result).toEqual({
      comments: [],
      status: RequestStatus.Idle,
    });
  });

  describe('fetchComments extraReducers', () => {
    it('should set status to "Loading" on fetchComments.pending', () => {
      const state = commentsSlice.reducer(
        undefined,
        fetchComments.pending(requestId, offerId),
      );

      expect(state.status).toBe(RequestStatus.Loading);
    });

    it('should set status to "Success" and update comments on fetchComments.fulfilled', () => {
      const mockComments = [mockComment];
      const state = commentsSlice.reducer(
        undefined,
        fetchComments.fulfilled(mockComments, requestId, offerId),
      );

      expect(state).toEqual({
        comments: mockComments,
        status: RequestStatus.Success,
      });
    });

    it('should set status to "Failed" on fetchComments.rejected', () => {
      const state = commentsSlice.reducer(
        undefined,
        fetchComments.rejected(
          new Error('Request failed'),
          requestId,
          offerId,
          { status: 500, message: 'Comments not found' },
        ),
      );

      expect(state.status).toBe(RequestStatus.Failed);
    });
  });

  describe('postComment extraReducers', () => {
    const postArgs = {
      offerId,
      body: { comment: 'Nice place!', rating: 5 },
    };

    it('should set status to "Loading" on postComment.pending', () => {
      const state = commentsSlice.reducer(
        undefined,
        postComment.pending(requestId, postArgs),
      );

      expect(state.status).toBe(RequestStatus.Loading);
    });

    it('should add comment to the existing list and set status to "Success" on postComment.fulfilled', () => {
      const existingComment = { ...mockComment, id: '0' };
      const initialState = {
        comments: [existingComment],
        status: RequestStatus.Loading,
      };

      const state = commentsSlice.reducer(
        initialState,
        postComment.fulfilled(mockComment, requestId, postArgs),
      );

      expect(state.comments).toHaveLength(2);
      expect(state.comments[1]).toEqual(mockComment);
      expect(state.status).toBe(RequestStatus.Success);
    });

    it('should set status to "Failed" on postComment.rejected', () => {
      const state = commentsSlice.reducer(
        undefined,
        postComment.rejected(new Error('Request failed'), requestId, postArgs, {
          status: 500,
          message: "Comment wasn't posted",
        }),
      );

      expect(state.status).toBe(RequestStatus.Failed);
    });
  });

  describe('selectors', () => {
    it('should select comments', () => {
      expect(selectComments(rootState)).toEqual([mockComment]);
    });

    it('should select comments status', () => {
      expect(selectCommentsStatus(rootState)).toBe(RequestStatus.Success);
    });
  });
});
