import axios from "axios"
import { LoginPayload, AuthResponse, RegisterPayload } from "@/types/api";
import Toast from "react-native-toast-message";

const BACKEND_URL = "https://api.youths.live";

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
      Toast.show({ type: 'error', text1: err.response?.data.message });
    } 
  } else {
    Toast.show({ type: 'error', text1: 'Unexpected error' });
  }
}

async function login(payload: LoginPayload) {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    Toast.show({
      type: "success",
      text1: data.message
    });
    return data;
  } catch (err) {
    showErrorToast(err);
  }
}

async function register(payload: RegisterPayload): Promise<AuthResponse> {
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

export {
  api,
  Toast,
  showErrorToast,
  login,
  register,
}