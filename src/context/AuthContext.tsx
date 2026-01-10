"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { me as apiMe, logout as apiLogout } from "@/lib/auth";
import API from "@/lib/api";

type User = { id: string; name: string; avatar?: string } | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  signIn: (
    user: { id: string; name: string; avatar?: string },
    token?: string
  ) => void;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper to fetch profile photo
async function fetchUserProfile(userId: string): Promise<string | undefined> {
  try {
    const res = await API.get(`/v1/profile/id/${userId}`);
    return res.data?.photo_url || undefined;
  } catch {
    return undefined;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh user profile (including avatar)
  const refreshProfile = async () => {
    if (!user?.id) return;
    const photoUrl = await fetchUserProfile(user.id);
    if (photoUrl) {
      setUser((prev) => (prev ? { ...prev, avatar: photoUrl } : prev));
    }
  };

  useEffect(() => {
    // Sync with NextAuth session
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (status === "authenticated" && session) {
      // User is authenticated via NextAuth
      const sessionUser = (session as any).user;
      if (sessionUser) {
        const baseUser = sessionUser as User;
        setUser(baseUser);
        // Fetch profile photo
        if (baseUser?.id) {
          fetchUserProfile(baseUser.id).then((photoUrl) => {
            if (photoUrl) {
              setUser((prev) => (prev ? { ...prev, avatar: photoUrl } : prev));
            }
          });
        }
        setLoading(false);
        return;
      }
    }

    // Fallback to localStorage for backwards compatibility
    try {
      const rawUser = localStorage.getItem("imfo_user");
      const token = localStorage.getItem("imfo_token");
      if (token) {
        apiMe()
          .then(async (data) => {
            // backend may return { user } or direct user
            const userData = (data && (data.user || data)) as User;
            if (userData?.id) {
              const photoUrl = await fetchUserProfile(userData.id);
              if (photoUrl) {
                setUser({ ...userData, avatar: photoUrl });
              } else {
                setUser(userData);
              }
            } else {
              setUser(userData);
            }
          })
          .catch(() => {
            // Token is invalid, clear everything
            localStorage.removeItem("imfo_token");
            localStorage.removeItem("imfo_user");
            setUser(null);
          })
          .finally(() => setLoading(false));
      } else {
        // No token, clear user data
        if (rawUser) {
          localStorage.removeItem("imfo_user");
        }
        setUser(null);
        setLoading(false);
      }
    } catch (e) {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("imfo_user", JSON.stringify(user));
      else localStorage.removeItem("imfo_user");
    } catch (e) {
      /* ignore */
    }
  }, [user]);

  const signIn = (
    u: { id: string; name: string; avatar?: string },
    token?: string
  ) => {
    setUser(u);
    try {
      if (token) localStorage.setItem("imfo_token", token);
    } catch (e) {
      /* ignore */
    }
  };

  const signOut = async () => {
    try {
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
    } catch (e) {
      /* ignore */
    }
    try {
      await apiLogout();
    } catch (e) {
      /* ignore */
    }
    try {
      localStorage.removeItem("imfo_token");
      localStorage.removeItem("imfo_user");
    } catch (e) {
      /* ignore */
    }
    setUser(null);
    // Navigate to home page
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
