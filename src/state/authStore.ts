import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole } from "../types/cafe";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  googleEmail: string | null; // Store Google account email after sign-in
  googleName: string | null;
  googlePhoto: string | null;
  adminPassword: string | null; // Separate password for admin role
  staffPassword: string | null; // Separate password for staff role
  setGoogleAccount: (email: string, name: string, photo?: string) => void;
  login: (role: UserRole, password: string) => boolean;
  logout: () => void;
  setupRolePassword: (role: UserRole, password: string) => boolean;
  isRolePasswordSet: (role: UserRole) => boolean;
  clearAllData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      googleEmail: null,
      googleName: null,
      googlePhoto: null,
      adminPassword: null,
      staffPassword: null,

      setGoogleAccount: (email: string, name: string, photo?: string) => {
        set({
          googleEmail: email,
          googleName: name,
          googlePhoto: photo,
        });
      },

      login: (role: UserRole, password: string) => {
        const state = get();

        // Check if Google account is set
        if (!state.googleEmail || !state.googleName) {
          console.log("[Auth] No Google account connected");
          return false;
        }

        // Verify role password
        const rolePassword = role === "admin" ? state.adminPassword : state.staffPassword;

        if (!rolePassword) {
          console.log("[Auth] Password not set for role:", role);
          return false;
        }

        if (rolePassword !== password) {
          console.log("[Auth] Incorrect password for role:", role);
          return false;
        }

        // Create user object
        const user: User = {
          id: `${role}-${state.googleEmail}`,
          username: state.googleEmail,
          password: rolePassword,
          role,
          name: state.googleName,
          email: state.googleEmail,
          photoUrl: state.googlePhoto || undefined,
          createdAt: new Date().toISOString(),
        };

        set({ currentUser: user, isAuthenticated: true });
        console.log("[Auth] Login successful for role:", role);
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
        console.log("[Auth] User logged out");
      },

      setupRolePassword: (role: UserRole, password: string) => {
        const state = get();

        if (!state.googleEmail) {
          console.log("[Auth] Cannot setup password without Google account");
          return false;
        }

        if (role === "admin") {
          set({ adminPassword: password });
          console.log("[Auth] Admin password set");
        } else {
          set({ staffPassword: password });
          console.log("[Auth] Staff password set");
        }

        return true;
      },

      isRolePasswordSet: (role: UserRole) => {
        const state = get();
        return role === "admin" ? !!state.adminPassword : !!state.staffPassword;
      },

      clearAllData: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          googleEmail: null,
          googleName: null,
          googlePhoto: null,
          adminPassword: null,
          staffPassword: null,
        });
        console.log("[Auth] All data cleared");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
