// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of your user info
interface User {
  _id: string;
  email: string;
  credits: number;
  referralCode: string;
}

// Define the shape of your store's state
interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  // 'persist' middleware saves the store to localStorage
  // This means you stay logged in even after refreshing the page!
  persist(
    (set) => ({
      token: null,
      user: null,

      // Action to set token and user on login
      login: (token, user) => set({ token, user }),

      // Action to clear token and user on logout
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
    }
  )
);