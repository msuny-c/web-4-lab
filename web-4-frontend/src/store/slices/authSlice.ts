import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/api';
import type { LoginRequest, RegisterRequest } from '../../api/types';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', credentials.username);
    return { token: response.token, username: credentials.username };
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterRequest) => {
    const response = await authApi.register(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', credentials.username);
    return { token: response.token, username: credentials.username };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 