/**
 * Authentication store using Zustand
 * Manages user authentication state with persistent token storage
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import { UserRole } from '@/constants/enums';
import type { User } from '@/constants/interfaces';

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Authentication actions interface
 */
interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  refresh: () => Promise<string | null>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
  clearToken: () => void;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  accessToken: null, // Will be hydrated from localStorage by persist middleware
  refreshToken: null,
  error: null,
  isLoading: true, // Start as true to trigger checkAuth on app initialization
};

/**
 * Create authentication store with persistence
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  // Use persist middleware to save token to localStorage
  persist(
    (set, get) => ({
      ...initialState,

      // Synchronous actions (equivalent to Redux reducers)
      clearError: () => set({ error: null }),
      setUser: (user) => set({ user }),

      // Asynchronous actions (equivalent to Redux async thunks)
      login: async (credentials) => {
        set({ error: null }); // Clear any previous errors (pending state)
        try {
          const response = await Request.post<{
            accessToken: string;
            refreshToken: string;
            role: string;
          }>(API_ENDPOINTS.LOGIN, credentials);
          // Success: update user and token (fulfilled state)
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          await get().checkAuth();
          // Persist middleware automatically saves token to localStorage
        } catch (error: any) {
          // Error: set error message (rejected state)
          set({
            error: error.response?.data?.message || 'Login failed',
          });
        }
      },

      refresh: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const response = await Request.post<{
            accessToken: string;
            refreshToken: string;
            role: string;
          }>(API_ENDPOINTS.REFRESH_TOKEN, {
            refreshToken,
          });

          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          return response.accessToken;
        } catch (error) {
          console.error('Refresh token failed', error);
          get().logout();
          return null;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true }); // Start loading (pending state)

        if (!get().accessToken) {
          set({ ...initialState, isLoading: false });
          return;
        }

        try {
          const user = await Request.get<User>(API_ENDPOINTS.ME);
          if (!user) throw new Error('No user data');

          // Success: update user data (fulfilled state)
          set({ user, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const accessToken = get().accessToken;

        await Request.post<{ message: string }>(API_ENDPOINTS.LOGOUT, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
          isLoading: false,
        });
        // Persist middleware automatically removes token from localStorage
      },

      clearToken: async () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: 'auth-token-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

/**
 * Selectors for accessing auth state
 * Can be used directly in components: const user = useAuthStore(selectUser)
 */
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => !!state.accessToken;
export const selectIsAdmin = (state: AuthState) =>
  state.user?.role === UserRole.ADMIN;
export const selectError = (state: AuthState) => state.error;
export const selectIsLoading = (state: AuthState) => state.isLoading;
