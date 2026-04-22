import { AuthorizationStatus, RequestStatus } from '@/const';
import { User } from '@/types/user';
import {
  selectUserInfo,
  selectUserRequestStatus,
  selectAuthStatus,
  selectIsAuthorized,
} from './user-slice';

describe('User selectors', () => {
  const mockUser: User = {
    name: 'Oliver Cone',
    avatarUrl: 'https://url.com/avatar.jpg',
    isPro: false,
    email: 'oliver@gmail.com',
    token: 'secret-token',
  };

  const state = {
    user: {
      info: mockUser,
      userRequestStatus: RequestStatus.Success,
      authStatus: AuthorizationStatus.Auth,
    },
  };

  it('should return user info from state', () => {
    expect(selectUserInfo(state)).toEqual(mockUser);
  });

  it('should return request status from state', () => {
    expect(selectUserRequestStatus(state)).toBe(RequestStatus.Success);
  });

  it('should return auth status from state', () => {
    expect(selectAuthStatus(state)).toBe(AuthorizationStatus.Auth);
  });

  describe('selectIsAuthorized', () => {
    it('should return true when status is Auth', () => {
      expect(selectIsAuthorized(state)).toBe(true);
    });

    it('should return false when status is NoAuth', () => {
      const noAuthState = {
        user: {
          ...state.user,
          authStatus: AuthorizationStatus.NoAuth,
        },
      };
      expect(selectIsAuthorized(noAuthState)).toBe(false);
    });

    it('should return false when status is Unknown', () => {
      const unknownState = {
        user: {
          ...state.user,
          authStatus: AuthorizationStatus.Unknown,
        },
      };
      expect(selectIsAuthorized(unknownState)).toBe(false);
    });
  });
});
