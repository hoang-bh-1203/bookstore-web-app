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
  token: string | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Authentication actions interface
 */
interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

/**
 * Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  token: null, // Will be hydrated from localStorage by persist middleware
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
          const response = await Request.post<{ user: User; token: string }>(
            API_ENDPOINTS.LOGIN,
            credentials,
          );
          // Success: update user and token (fulfilled state)
          set({ user: response.user, token: response.token });
          // Persist middleware automatically saves token to localStorage
        } catch (error: any) {
          // Error: set error message (rejected state)
          set({
            error: error.response?.data?.message || 'Login failed',
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true }); // Start loading (pending state)
        const token = get().token; // Get token from persisted state

        if (!token) {
          set({ ...initialState, isLoading: false, token: null }); // No token, skip authentication check
          return;
        }

        try {
          const user = await Request.get<User>(API_ENDPOINTS.ME);
          if (!user) throw new Error('No user data');

          // Success: update user data (fulfilled state)
          set({ user, isLoading: false });
          localStorage.setItem('user', JSON.stringify(user)); // Keep existing user storage logic
        } catch (error: any) {
          // Error: clear auth state (rejected state)
          set({ user: null, token: null, isLoading: false });
          localStorage.removeItem('user');
          console.error('Invalid token:', error);
        }
      },

      logout: () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        set({ user: null, token: null, error: null });
        // Persist middleware automatically removes token from localStorage
      },
    }),
    {
      name: 'auth-token-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // Only persist the token field
    },
  ),
);

/**
 * Selectors for accessing auth state
 * Can be used directly in components: const user = useAuthStore(selectUser)
 */
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => !!state.token;
export const selectIsAdmin = (state: AuthState) =>
  state.user?.role === UserRole.ADMIN;
export const selectError = (state: AuthState) => state.error;
export const selectIsLoading = (state: AuthState) => state.isLoading;
