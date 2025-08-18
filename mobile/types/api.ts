export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  eligibility: boolean;
  inScore: number;
  createdAt: string;
  updatedAt: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdByPhone: string;
}

export interface Score {
  id: number;
  userId: number;
  score: number;
  createdAt: string;
}

export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// Auth API Types
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Product API Types
export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}

// Score API Types
export interface CreateScorePayload {
  userId: number;
  score: number;
}

// Config Types
export interface ExpoConfig {
  apiUrl: string;
}

// API Error Response
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}