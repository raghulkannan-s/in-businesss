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
  users?: User[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
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
  user?: User;
}

export interface Match {
  id: number;
  team1Name: string;
  team2Name: string;
  tossWinner: number;
  tossDecision: 'bat' | 'bowl';
  overs: number;
  status: 'upcoming' | 'live' | 'completed';
  currentInning: number;
  team1Score: number;
  team1Wickets: number;
  team2Score: number;
  team2Wickets: number;
  currentOver: number;
  currentBall: number;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ball {
  id: number;
  matchId: number;
  over: number;
  ball: number;
  runs: number;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout';
  batsman: string;
  bowler: string;
  extras?: 'wide' | 'noball' | 'bye' | 'legbye';
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

// Match API Types
export interface CreateMatchPayload {
  team1Name: string;
  team2Name: string;
  tossWinner: number;
  tossDecision: 'bat' | 'bowl';
  overs: number;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
}

export interface UpdateMatchPayload {
  team1Score?: number;
  team1Wickets?: number;
  team2Score?: number;
  team2Wickets?: number;
  currentOver?: number;
  currentBall?: number;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
  status?: 'upcoming' | 'live' | 'completed';
  currentInning?: number;
}

export interface BallPayload {
  matchId: number;
  over: number;
  ball: number;
  runs: number;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout';
  batsman: string;
  bowler: string;
  extras?: 'wide' | 'noball' | 'bye' | 'legbye';
}

// Product API Types
export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

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