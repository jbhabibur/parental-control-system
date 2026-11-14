import React, { createContext, useContext, useEffect, useState } from "react";
import {
  api,
  clearTokens,
  getRefreshToken,
  hasAccessToken,
  saveTokens,
} from "../lib/api";

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  role: "PARENT" | "CHILD";
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  createdAt?: string;
}

interface AuthContextType {
  user: ParentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginSuccess: (
    user: ParentUser,
    tokens: { accessToken: string; refreshToken: string },
  ) => Promise<void>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ParentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (): Promise<ParentUser | null> => {
    try {
      const res = await api.auth.parentMe();
      if (res && res.user) {
        return res.user as ParentUser;
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let active = true;

    async function initAuth() {
      try {
        const hasToken = await hasAccessToken("user");
        if (!hasToken) {
          if (active) setUser(null);
          return;
        }

        const profile = await fetchProfile();
        if (active) {
          if (profile && profile.status === "ACTIVE") {
            setUser(profile);
          } else {
            await clearTokens("user");
            setUser(null);
          }
        }
      } catch {
        if (active) {
          await clearTokens("user");
          setUser(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void initAuth();

    return () => {
      active = false;
    };
  }, []);

  const loginSuccess = async (
    newUser: ParentUser,
    tokens: { accessToken: string; refreshToken: string },
  ) => {
    await saveTokens("user", tokens);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      const refreshToken = await getRefreshToken("user");
      if (refreshToken) {
        await api.auth.logout(refreshToken).catch(() => {});
      }
    } finally {
      await clearTokens("user");
      setUser(null);
    }
  };

  const reloadProfile = async () => {
    const profile = await fetchProfile();
    if (profile) {
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginSuccess,
        logout,
        reloadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

