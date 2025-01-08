import type { LoginRequest, RegisterRequest, AuthResponse, PointRequest, PointResponse } from './types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Something went wrong' }));
    if (response.status === 404 && error.error === 'User not found') {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
      throw new Error('Invalid credentials. Please try again.');
    }
    if (response.status === 400 && error.error === 'User already exists') {
      throw new Error('User already exists. Please choose a different username.');
    }
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  register: async (credentials: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },
};

export const pointsApi = {
  checkPoint: async (point: PointRequest): Promise<PointResponse> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/points/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(point),
    });
    return handleResponse<PointResponse>(response);
  },

  getAllPoints: async (): Promise<PointResponse[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/points`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    return handleResponse<PointResponse[]>(response);
  },
}; 