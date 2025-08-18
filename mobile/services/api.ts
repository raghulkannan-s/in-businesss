import axios from "axios";
import Constants from "expo-constants";
import { 
  LoginPayload, 
  AuthResponse, 
  RegisterPayload, 
  User,
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  Score,
  CreateScorePayload,
  Team,
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

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      SecureStore.deleteItemAsync('accessToken');
      SecureStore.deleteItemAsync('refreshToken');
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
    Toast.show({ type: "success", text1: data.message });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    Toast.show({ type: "success", text1: data.message });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    const { data } = await api.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken
    });
    await SecureStore.setItemAsync('accessToken', data.accessToken);
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

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
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

// Score API
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

// Team API
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

// Eligibility API
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
