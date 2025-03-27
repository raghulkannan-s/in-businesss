import { ENDPOINTS } from '@/constants/endpoints';

interface LoginResponse {
  _id: string;
  name: string;
  phone: string;
  token: string;
}

interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
}

export async function loginUser(phone: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(
  name: string,
  email: string, 
  phone: string, 
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function forgotPassword(phone: string): Promise<{ message: string }> {
  try {
    const response = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
}