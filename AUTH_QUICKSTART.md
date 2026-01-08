## Quick Start Guide - API Authentication

Your authentication system is now fully connected! Here's what was set up:

### ✅ What's Configured

1. **NextAuth.js** - Handles authentication with your backend API
2. **API Client** - Automatically includes auth tokens in all requests
3. **Dual Auth System** - Syncs NextAuth with custom AuthContext
4. **Token Management** - Stores and refreshes tokens automatically

### 🚀 How to Use

#### In Your Components:

```tsx
import { useAuthState } from "@/hooks/useAuthState";

function MyComponent() {
  const { user, isAuthenticated, isLoading, signOut } = useAuthState();

  if (!isAuthenticated) return <div>Please log in</div>;
  return <div>Hello {user.name}!</div>;
}
```

#### Making API Calls:

```tsx
import API from "@/lib/api";

// Token is automatically attached!
const data = await API.get("/v1/photographers");
const profile = await API.post("/v1/users/profile", { name: "John" });
```

### 🔐 Testing Authentication

1. **Test the connection:**

   - Visit `/auth-test` to see authentication status
   - Click "Log in" in navbar to test login flow
   - Check if tokens are properly stored

2. **Test with your API:**

   ```bash
   # Make sure your API is running
   curl https://imfobookings-backend.vercel.app/health
   ```

3. **Try logging in:**
   - Click the login button in navbar
   - Enter credentials
   - Check Network tab for API calls to `/v1/auth/token` and `/v1/auth/get-user`

### 📝 Next Steps

1. **Update .env.local** if needed:

   - API URL is set to: `https://imfobookings-backend.vercel.app`
   - Change if your API is hosted elsewhere

2. **Test the login flow:**

   - Create a test account
   - Login with credentials
   - Verify token appears in session

3. **Protect your routes:**
   ```tsx
   // Example: Protect dashboard routes
   const { isAuthenticated } = useAuthState();
   if (!isAuthenticated) router.push("/");
   ```

### 🛠️ Files Modified/Created

- ✅ `/src/components/Providers.tsx` - Wraps app with SessionProvider
- ✅ `/src/app/layout.tsx` - Uses Providers component
- ✅ `/src/lib/api.ts` - Enhanced with token management
- ✅ `/src/context/AuthContext.tsx` - Syncs with NextAuth
- ✅ `/src/hooks/useAuthState.ts` - Unified auth hook
- ✅ `/src/app/auth-test/page.tsx` - Test page
- ✅ `AUTHENTICATION.md` - Complete documentation

### 🔧 Environment Variables in .env.local

```env
NEXT_PUBLIC_API_URL=https://imfobookings-backend.vercel.app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kJ9vZEk_CJdrDlPuIgHhDlv8kh_RIoY0RV2W09pYcXs
```

### ⚡ Run the App

```bash
npm run dev
```

Then visit:

- `http://localhost:3000` - Main app
- `http://localhost:3000/auth-test` - Test authentication

---

**Need help?** Check [AUTHENTICATION.md](AUTHENTICATION.md) for detailed documentation.
