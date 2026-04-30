import type User from "@/models/User";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setBootstrapping: (value: boolean) => void;
  setSession: (accessToken: string, user: User) => void;
  updateUser: (user: User) => void;
  clearSession: () => void;
};

const useAuth = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isBootstrapping: true,
  setBootstrapping: (value) => set({ isBootstrapping: value }),
  setSession: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),
  updateUser: (user) => set({ user }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    }),
}));

export default useAuth;
