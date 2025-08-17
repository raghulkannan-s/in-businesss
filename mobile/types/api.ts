
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload{
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface User {
  name: string;
  email: string;
  role: string;
  phone: string;
  inScore: number;
  eligibility: boolean;

}
export interface AuthResponse {
  message: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface ExpoConfig {
  apiUrl: string;
}