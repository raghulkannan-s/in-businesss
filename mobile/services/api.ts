import axios from "axios";
import Constants from "expo-constants";
import { LoginPayload, AuthResponse, RegisterPayload, ExpoConfig } from "@/types/api";
import Toast from "react-native-toast-message";

const { apiUrl } = Constants.expoConfig?.extra as ExpoConfig;

const BACKEND_URL = apiUrl;

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function showErrorToast(err: any) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status && [400, 404, 500].includes(status)) {
      const msg = (err.response?.data as any)?.message || `Request failed (${status})`;
      Toast.show({ type: 'error', text1: msg });
    }
  } else {
    Toast.show({ type: 'error', text1: 'Unexpected error' });
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    Toast.show({
      type: "success",
      text1: data.message
    });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    Toast.show({
      type: "success",
      text1: data.message,
    });
    return data;
  } catch (err) {
    showErrorToast(err);
    throw err;
  }
}
