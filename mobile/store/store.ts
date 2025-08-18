import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, Product, Team, Score } from "@/types/api";
import { getCurrentUser, getProducts, getTeams, getScores } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  loadTokensFromSecureStore: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  fetchUserProfile: () => Promise<void>;
}

interface DataState {
  products: Product[];
  teams: Team[];
  scores: Score[];
  isLoadingData: boolean;

  setProducts: (products: Product[]) => void;
  setTeams: (teams: Team[]) => void;
  setScores: (scores: Score[]) => void;
  fetchProducts: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  fetchScores: () => Promise<void>;
  setLoadingData: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user: User, accessToken: string, refreshToken: string) => {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  loadTokensFromSecureStore: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (accessToken && refreshToken) {
        set({
          isAuthenticated: true,
          isLoading: false,
        });
        // Fetch user profile after token validation
        get().fetchUserProfile();
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
      set({ isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, logout
      get().logout();
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

export const useDataStore = create<DataState>((set, get) => ({
  products: [],
  teams: [],
  scores: [],
  isLoadingData: false,

  setProducts: (products: Product[]) => {
    set({ products });
  },

  setTeams: (teams: Team[]) => {
    set({ teams });
  },

  setScores: (scores: Score[]) => {
    set({ scores });
  },

  fetchProducts: async () => {
    try {
      set({ isLoadingData: true });
      const products = await getProducts();
      set({ products });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ isLoadingData: false });
    }
  },

  fetchTeams: async () => {
    try {
      set({ isLoadingData: true });
      const teams = await getTeams();
      set({ teams });
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      set({ isLoadingData: false });
    }
  },

  fetchScores: async () => {
    try {
      set({ isLoadingData: true });
      const scores = await getScores();
      set({ scores });
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    } finally {
      set({ isLoadingData: false });
    }
  },

  setLoadingData: (loading: boolean) => {
    set({ isLoadingData: loading });
  },
}));