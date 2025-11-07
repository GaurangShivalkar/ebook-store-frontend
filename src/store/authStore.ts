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

  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', 
    }
  )
);