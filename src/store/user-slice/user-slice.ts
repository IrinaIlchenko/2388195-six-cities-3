import { RequestStatus, AuthorizationStatus } from '@/const';
import { User } from '@/types/user';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { checkAuth, login, logout } from '../thunk/user-auth';

interface UserState {
  info: User | null;
  userRequestStatus: RequestStatus;
  authStatus: AuthorizationStatus;
}

const initialState: UserState = {
  info: null,
  userRequestStatus: RequestStatus.Idle,
  authStatus: AuthorizationStatus.Unknown,
};

function processSuccess(state: UserState, action: PayloadAction<User>) {
  state.info = action.payload;
  state.authStatus = AuthorizationStatus.Auth;
  state.userRequestStatus = RequestStatus.Success;
}

function processFailed(state: UserState) {
  state.userRequestStatus = RequestStatus.Failed;
  state.authStatus = AuthorizationStatus.NoAuth;
}

function processLoading(state: UserState) {
  state.userRequestStatus = RequestStatus.Loading;
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, processSuccess);
    builder.addCase(checkAuth.rejected, processFailed);
    builder.addCase(checkAuth.pending, processLoading);
    builder.addCase(login.fulfilled, processSuccess);
    builder.addCase(login.rejected, processFailed);
    builder.addCase(login.pending, processLoading);
    builder.addCase(logout.fulfilled, (state) => {
      state.info = null;
      state.authStatus = AuthorizationStatus.NoAuth;
    });
  },
  selectors: {
    selectUserInfo: (state: UserState) => state.info,
    selectUserRequestStatus: (state: UserState) => state.userRequestStatus,
    selectAuthStatus: (state: UserState) => state.authStatus,
  },
});

export const { selectUserInfo, selectUserRequestStatus, selectAuthStatus } =
  userSlice.selectors;

export const selectIsAuthorized = createSelector(
  [selectAuthStatus],
  (status) => status === AuthorizationStatus.Auth,
);
