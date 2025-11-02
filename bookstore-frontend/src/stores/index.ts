/**
 * State Stores
 *
 * Purpose: Global state management using Zustand.
 *
 * Tech Stack:
 * - Zustand (lightweight state management)
 * - TypeScript for type-safe stores
 * - Minimal boilerplate, no providers needed
 *
 * Example:
 * import { create } from 'zustand'
 * export const useAuthStore = create<AuthState>((set) => ({
 *   user: null,
 *   login: (user) => set({ user }),
 *   logout: () => set({ user: null })
 * }))
 */

export {};
