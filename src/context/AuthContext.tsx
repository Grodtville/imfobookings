"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; avatar?: string } | null;

type AuthContextValue = {
  user: User;
  signIn: (user: { id: string; name: string; avatar?: string }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("imfo_user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("imfo_user", JSON.stringify(user));
      else localStorage.removeItem("imfo_user");
    } catch (e) {
      /* ignore */
    }
  }, [user]);

  const signIn = (u: { id: string; name: string; avatar?: string }) =>
    setUser(u);
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
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
