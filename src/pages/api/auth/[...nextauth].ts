import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { NextAuthOptions } from "next-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXTAUTH_API_URL || "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        try {
          // backend expects x-www-form-urlencoded for /v1/auth/login
          const params = new URLSearchParams();
          params.append("username", credentials.username);
          params.append("password", credentials.password);
          params.append("grant_type", "password");

          const tokenRes = await axios.post(`${API_BASE}/v1/auth/login`, params.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          const tokenData = tokenRes.data || {};
          const access = tokenData.access_token;

          if (!access) return null;

          // fetch user profile using access token
          const userRes = await axios.get(`${API_BASE}/v1/auth/me`, {
            headers: { Authorization: `Bearer ${access}` },
          });

          const user = userRes.data || {};

          // attach tokens to the returned user object so callbacks can persist them
          return {
            ...user,
            accessToken: access,
            refreshToken: tokenData.refresh_token,
          } as any;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).accessToken) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        // Store user data in token for session
        token.id = (user as any).id;
        token.username = (user as any).username;
        token.email = (user as any).email;
        token.name = (user as any).name || (user as any).username;
        token.avatar = (user as any).avatar || (user as any).profile_image;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      // Merge user info from token into session
      if (token) {
        session.user = {
          ...session.user,
          id: (token as any).id,
          name: (token as any).name || (token as any).username,
          email: (token as any).email,
          avatar: (token as any).avatar,
        } as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
