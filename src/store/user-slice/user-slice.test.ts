import { AuthorizationStatus, RequestStatus } from '@/const';
import type { User } from '@/types/user';
import type { RootState } from '@/types/store';
import {
  userSlice,
  selectUserInfo,
  selectUserRequestStatus,
  selectAuthStatus,
  selectIsAuthorized,
} from './user-slice';
import { checkAuth, login, logout } from '../thunk/user-auth';

describe('userSlice', () => {
  const mockUser: User = {
    name: 'John',
    avatarUrl: 'img/avatar.jpg',
    isPro: true,
    email: 'john@mail.com',
    token: 'secret-token',
  };

  const requestId = 'request-123';

  const createRootState = (
    userState?: Partial<{
      info: User | null;
      userRequestStatus: RequestStatus;
      authStatus: AuthorizationStatus;
    }>,
  ): RootState =>
    ({
      app: {} as RootState['app'],
      offers: {} as RootState['offers'],
      offer: {} as RootState['offer'],
      comments: {} as RootState['comments'],
      favoriteOffers: {} as RootState['favoriteOffers'],
      user: {
        info: null,
        userRequestStatus: RequestStatus.Idle,
        authStatus: AuthorizationStatus.Unknown,
        ...userState,
      },
    }) as RootState;

  it('should return initial state', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual({
      info: null,
      userRequestStatus: RequestStatus.Idle,
      authStatus: AuthorizationStatus.Unknown,
    });
  });

  describe('checkAuth extraReducers', () => {
    it('should set loading status on pending', () => {
      const state = userSlice.reducer(
        undefined,
        checkAuth.pending(requestId, undefined),
      );

      expect(state).toEqual({
        info: null,
        userRequestStatus: RequestStatus.Loading,
        authStatus: AuthorizationStatus.Unknown,
      });
    });

    it('should save user and set auth on fulfilled', () => {
      const state = userSlice.reducer(
        undefined,
        checkAuth.fulfilled(mockUser, requestId, undefined),
      );

      expect(state).toEqual({
        info: mockUser,
        userRequestStatus: RequestStatus.Success,
        authStatus: AuthorizationStatus.Auth,
      });
    });

    it('should set failed status and noAuth on rejected', () => {
      const state = userSlice.reducer(
        undefined,
        checkAuth.rejected(null, requestId, undefined),
      );

      expect(state).toEqual({
        info: null,
        userRequestStatus: RequestStatus.Failed,
        authStatus: AuthorizationStatus.NoAuth,
      });
    });
  });

  describe('login extraReducers', () => {
    it('should set loading status on pending', () => {
      const state = userSlice.reducer(
        undefined,
        login.pending(requestId, {
          email: 'john@mail.com',
          password: '123456',
        }),
      );

      expect(state).toEqual({
        info: null,
        userRequestStatus: RequestStatus.Loading,
        authStatus: AuthorizationStatus.Unknown,
      });
    });

    it('should save user and set auth on fulfilled', () => {
      const state = userSlice.reducer(
        undefined,
        login.fulfilled(mockUser, requestId, {
          email: 'john@mail.com',
          password: '123456',
        }),
      );

      expect(state).toEqual({
        info: mockUser,
        userRequestStatus: RequestStatus.Success,
        authStatus: AuthorizationStatus.Auth,
      });
    });

    it('should set failed status and noAuth on rejected', () => {
      const state = userSlice.reducer(
        undefined,
        login.rejected(null, requestId, {
          email: 'john@mail.com',
          password: '123456',
        }),
      );

      expect(state).toEqual({
        info: null,
        userRequestStatus: RequestStatus.Failed,
        authStatus: AuthorizationStatus.NoAuth,
      });
    });
  });

  describe('logout extraReducers', () => {
    it('should clear user info and set noAuth on fulfilled', () => {
      const initialState = {
        info: mockUser,
        userRequestStatus: RequestStatus.Success,
        authStatus: AuthorizationStatus.Auth,
      };

      const state = userSlice.reducer(
        initialState,
        logout.fulfilled(undefined, requestId, undefined),
      );

      expect(state).toEqual({
        info: null,
        userRequestStatus: RequestStatus.Success,
        authStatus: AuthorizationStatus.NoAuth,
      });
    });
  });

  describe('selectors', () => {
    it('should select user info', () => {
      const rootState = createRootState({ info: mockUser });
      expect(selectUserInfo(rootState)).toEqual(mockUser);
    });

    it('should select user request status', () => {
      const rootState = createRootState({
        userRequestStatus: RequestStatus.Loading,
      });
      expect(selectUserRequestStatus(rootState)).toBe(RequestStatus.Loading);
    });

    it('should select auth status', () => {
      const rootState = createRootState({
        authStatus: AuthorizationStatus.Auth,
      });
      expect(selectAuthStatus(rootState)).toBe(AuthorizationStatus.Auth);
    });

    it('should return true when user is authorized', () => {
      const rootState = createRootState({
        authStatus: AuthorizationStatus.Auth,
      });
      expect(selectIsAuthorized(rootState)).toBe(true);
    });

    it('should return false when user is not authorized', () => {
      const rootState = createRootState({
        authStatus: AuthorizationStatus.NoAuth,
      });
      expect(selectIsAuthorized(rootState)).toBe(false);
    });
  });
});
