import axios from "axios";
import {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  User,
  Product,
  CreateProductPayload,
  Score,
  CreateScorePayload,
  Team,
  Match,
  CreateMatchPayload,
  UpdateMatchPayload,
  Ball,
  BallPayload,
  ApiError
} from "@/types/api";

import Toast from "react-native-toast-message";
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = "https://api.youths.live";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or forbidden, try to refresh
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await api.post(`/auth/replenish`, {
            refreshToken
          });

          const { accessToken } = response.data;
          await SecureStore.setItemAsync('accessToken', accessToken);

          // Retry original request
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

function showErrorToast(err: any) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status && [400, 401, 403, 404, 500].includes(status)) {
      const msg = (err.response?.data as ApiError)?.message || `Request failed (${status})`;
      Toast.show({ type: 'error', text1: msg });
    }
  } else {
    Toast.show({ type: 'error', text1: 'Unexpected error' });
  }
}

// Auth API
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    Toast.show({ type: "success", text1: "Login successful" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    Toast.show({ type: "success", text1: "Registration successful" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

// User API
export async function getCurrentUser(): Promise<User> {
  try {
    const { data } = await api.get<User>("/user/profile");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function updateUser(userData: Partial<User>): Promise<User> {
  try {
    const { data } = await api.put<User>("/user/profile", userData);
    Toast.show({ type: "success", text1: "Profile updated successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data } = await api.get<User[]>("/user");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

// Product API
export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<Product[]>("/product");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  try {
    const { data } = await api.post<Product>("/product", payload);
    Toast.show({ type: "success", text1: "Product created successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function updateProduct(id: number, payload: Partial<CreateProductPayload>): Promise<Product> {
  try {
    const { data } = await api.put<Product>(`/product/${id}`, payload);
    Toast.show({ type: "success", text1: "Product updated successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await api.delete(`/product/${id}`);
    Toast.show({ type: "success", text1: "Product deleted successfully" });
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getScores(): Promise<Score[]> {
  try {
    const { data } = await api.get<Score[]>("/score");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function createScore(payload: CreateScorePayload): Promise<Score> {
  try {
    const { data } = await api.post<Score>("/score", payload);
    Toast.show({ type: "success", text1: "Score created successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getTeams(): Promise<Team[]> {
  try {
    const { data } = await api.get<Team[]>("/team");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function createTeam(name: string): Promise<Team> {
  try {
    const { data } = await api.post<Team>("/team", { name });
    Toast.show({ type: "success", text1: "Team created successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getMatches(): Promise<Match[]> {
  try {
    const { data } = await api.get<Match[]>("/match");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function createMatch(payload: CreateMatchPayload): Promise<Match> {
  try {
    const { data } = await api.post<Match>("/match", payload);
    Toast.show({ type: "success", text1: "Match created successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getMatch(id: number): Promise<Match> {
  try {
    const { data } = await api.get<Match>(`/match/${id}`);
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function updateMatch(id: number, payload: UpdateMatchPayload): Promise<Match> {
  try {
    const { data } = await api.put<Match>(`/match/${id}`, payload);
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function getBalls(matchId: number): Promise<Ball[]> {
  try {
    const { data } = await api.get<Ball[]>(`/match/${matchId}/balls`);
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function addBall(payload: BallPayload): Promise<Ball> {
  try {
    const { data } = await api.post<Ball>("/match/ball", payload);
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function uploadScreenshot(matchId: number, imageUri: string): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append('screenshot', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `match_${matchId}_${Date.now()}.jpg`,
    } as any);
    formData.append('matchId', matchId.toString());

    const token = await SecureStore.getItemAsync('accessToken');
    const response = await fetch(`${BACKEND_URL}/upload/screenshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Screenshot upload failed');
    }

    const data = await response.json();
    Toast.show({ type: "success", text1: "Screenshot uploaded successfully" });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function checkEligibility(): Promise<{ eligible: boolean; score: number }> {
  try {
    const { data } = await api.get<{ eligible: boolean; score: number }>("/eligibility");
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export default api;