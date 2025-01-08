export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface PointRequest {
  x: number;
  y: number;
  r: number;
}

export interface PointResponse {
  x: number;
  y: number;
  r: number;
  result: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  message: string;
}