// Secure API client with automatic token handling and input sanitization
interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown> | unknown[];
  headers?: Record<string, string>;
}

// Input sanitization function
const sanitizeInput = (input: unknown): unknown => {
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, unknown> = Array.isArray(input) ? [] : {};
    for (const key in input) {
      sanitized[key] = sanitizeInput((input as Record<string, unknown>)[key]);
    }
    return sanitized;
  }
  
  return input;
};

export const secureApiCall = async (endpoint: string, options: ApiOptions = {}): Promise<unknown> => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  
  if (token && options.method !== 'GET') {
    defaultHeaders['Authorization'] = token;
    defaultHeaders['X-CSRF-Token'] = token.split(' ')[1]; // Use JWT as CSRF token
  } else if (token) {
    defaultHeaders['Authorization'] = token;
  }
  
  const sanitizedBody = options.body ? sanitizeInput(options.body) : undefined;
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      body: sanitizedBody ? JSON.stringify(sanitizedBody) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Secure localStorage wrapper
export const secureStorage = {
  set: (key: string, value: unknown) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  get: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};