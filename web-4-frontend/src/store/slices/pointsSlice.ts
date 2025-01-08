import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pointsApi } from '../../api/api';
import type { PointRequest, PointResponse } from '../../api/types';

export interface PointsState {
  points: PointResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: PointsState = {
  points: [],
  loading: false,
  error: null,
};

export const checkPointAsync = createAsyncThunk(
  'points/check',
  async (point: PointRequest) => {
    const response = await pointsApi.checkPoint(point);
    return response;
  }
);

export const getAllPointsAsync = createAsyncThunk(
  'points/getAll',
  async () => {
    const response = await pointsApi.getAllPoints();
    return response;
  }
);

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    clearPoints: (state) => {
      state.points = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPointAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPointAsync.fulfilled, (state, action) => {
        state.points.push(action.payload);
        state.loading = false;
      })
      .addCase(checkPointAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to check point';
      })
      .addCase(getAllPointsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPointsAsync.fulfilled, (state, action) => {
        state.points = action.payload;
        state.loading = false;
      })
      .addCase(getAllPointsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch points';
      });
  },
});

export const { clearPoints } = pointsSlice.actions;
export default pointsSlice.reducer; 