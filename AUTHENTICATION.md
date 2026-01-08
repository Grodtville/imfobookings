# Authentication Setup

This application uses a dual authentication system combining **NextAuth.js** with a custom **AuthContext** for seamless API integration.

## Configuration

### Environment Variables

Set these in your `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://imfobookings-backend.vercel.app
NEXTAUTH_API_URL=https://imfobookings-backend.vercel.app

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**Important:** Update `NEXTAUTH_SECRET` with a secure random string in production. Generate one with:

```bash
openssl rand -base64 32
```

## How It Works

### 1. NextAuth Integration

- Located at `/src/pages/api/auth/[...nextauth].ts`
- Handles credential-based authentication with your API
- Manages JWT sessions with access and refresh tokens
- Endpoints:
  - `/api/auth/signin` - Sign in
  - `/api/auth/signout` - Sign out
  - `/api/auth/session` - Get current session

### 2. API Client (`/src/lib/api.ts`)

- Axios instance configured with your API base URL
- Automatically attaches Bearer tokens from:
  1. NextAuth session (primary)
  2. localStorage (fallback)
- Handles 401 errors and token cleanup

### 3. AuthContext (`/src/context/AuthContext.tsx`)

- Provides `useAuth()` hook for managing user state
- Syncs with NextAuth sessions
- Persists authentication state
- Methods:
  - `signIn(user, token)` - Sign in a user
  - `signOut()` - Sign out and clear all tokens

### 4. Combined Hook (`/src/hooks/useAuthState.ts`)

- Unified authentication interface
- Use this in your components:

```tsx
import { useAuthState } from "@/hooks/useAuthState";

function MyComponent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuthState();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome {user.name}!</div>;
}
```

## Authentication Flow

### Sign Up

1. User enters email and password in `AuthModal`
2. Calls `/v1/auth/create-user` to create account
3. Automatically signs in via NextAuth credentials provider
4. Access token stored in session and localStorage
5. User redirected to appropriate page

### Sign In

1. User enters credentials in `AuthModal`
2. NextAuth validates via `/v1/auth/token` endpoint
3. Fetches user data from `/v1/auth/get-user`
4. Creates JWT session with user data and tokens
5. Syncs with AuthContext for app-wide state

### Making Authenticated API Calls

The API client automatically includes the auth token:

```tsx
import API from "@/lib/api";

// Token is automatically attached
const response = await API.get("/v1/photographers");
const userProfile = await API.get("/v1/auth/get-user");
```

### Protected Routes

Use the `useAuthState` hook to protect routes:

```tsx
"use client";

import { useAuthState } from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

## API Endpoints

The backend provides these authentication endpoints:

- `POST /v1/auth/token` - OAuth2 token endpoint (login)
- `POST /v1/auth/create-user` - Create new user account
- `GET /v1/auth/get-user` - Get current user profile
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Logout (optional)
- `GET /v1/auth/get-all-users` - Get all users (admin)

## Testing Authentication

Visit `/auth-test` to see the current authentication status and test the integration.

## Troubleshooting

### "API request failed"

- Check that `NEXT_PUBLIC_API_URL` is set correctly
- Verify the API is running and accessible
- Check browser console for detailed error messages

### "Session not persisting"

- Ensure `NEXTAUTH_SECRET` is set
- Check cookies are enabled in browser
- Verify `NEXTAUTH_URL` matches your app URL

### "Token not included in requests"

- Check that user is authenticated via NextAuth
- Verify token is present in session
- Check localStorage for `imfo_token`

### "401 Unauthorized"

- Token may have expired - try logging in again
- Backend may not recognize the token format
- Check Authorization header format (should be `Bearer <token>`)

## Development vs Production

**Development:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
```

**Production:**

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXTAUTH_URL=https://your-app.com
```

Always use HTTPS in production for security.
