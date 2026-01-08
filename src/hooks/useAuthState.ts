import { useSession } from "next-auth/react";
import { useAuth as useCustomAuth } from "@/context/AuthContext";

/**
 * Combined authentication hook that leverages both NextAuth and custom AuthContext
 * This provides a unified interface for authentication across the app
 */
export function useAuthState() {
  const { data: session, status } = useSession();
  const { user: contextUser, signIn, signOut } = useCustomAuth();

  const isAuthenticated = status === "authenticated" || !!contextUser;
  const isLoading = status === "loading";
  const user = (session?.user as any) || contextUser;
  const accessToken = (session as any)?.accessToken;

  return {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    signIn,
    signOut,
    session,
  };
}
