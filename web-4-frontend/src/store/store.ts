import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import pointsReducer from './slices/pointsSlice.ts';
import type { AuthState } from './slices/authSlice.ts';
import type { PointsState } from './slices/pointsSlice.ts';

export interface RootState {
  auth: AuthState;
  points: PointsState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    points: pointsReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 