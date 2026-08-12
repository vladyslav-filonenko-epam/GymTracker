import { create } from 'zustand';

import { hashPin, keychainUtils } from 'src/shared/utils';

import type { AuthStep } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  isLoading: false,
  authStep: 'create',

  setAuthStep: step => set({ authStep: step }),

  initAuth: async () => {
    set({ isLoading: true });
    try {
      const existingHash = await keychainUtils.getPinHash();

      set({
        authStep: existingHash ? 'verify' : 'create',
        isAuthenticated: false,
        isLoading: false,
      });
    } catch {
      set({ authStep: 'create', isAuthenticated: false, isLoading: false });
    }
  },

  setupPin: async (pin: string) => {
    const hash = hashPin(pin);

    await keychainUtils.savePinHash(hash);
    set({ isAuthenticated: true });
  },

  verifyPin: async (pin: string) => {
    const storedHash = await keychainUtils.getPinHash();

    if (!storedHash) return false;

    const match = hashPin(pin) === storedHash;

    if (match) {
      set({ isAuthenticated: true });
    }

    return match;
  },

  logout: () => {
    set({ isAuthenticated: false });
  },
}));
