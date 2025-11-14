# Authentication Setup Guide

This document explains the authentication implementation in the Creative Templates App using Supabase Auth.

## Overview

The app uses Supabase Auth for user authentication with the following features:

- **Email/Password Authentication**: Users can log in with email and password
- **Protected Routes**: `/templates` and `/designs` routes require authentication
- **Middleware Protection**: Automatic redirect to login for unauthenticated users
- **Session Management**: Automatic session refresh and state management
- **Logout Functionality**: Users can log out from the navigation bar

## Setup Instructions

### 1. Configure Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Enable Email Auth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Ensure **Email** provider is enabled
4. Configure email templates if needed

### 3. Create Test Users

For testing, create users manually in Supabase:

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Click **Create user**

Alternatively, you can create users programmatically or implement a registration page.

## Architecture

### Authentication Flow

```
1. User visits protected route (e.g., /templates)
   ↓
2. Middleware checks authentication status
   ↓
3. If not authenticated → Redirect to /login?redirectTo=/templates
   ↓
4. User enters credentials and submits form
   ↓
5. Client calls supabase.auth.signInWithPassword()
   ↓
6. On success → Redirect to original destination
   ↓
7. Middleware allows access to protected route
```

### Key Components

#### 1. Middleware (`src/middleware.ts`)

- Runs on every request
- Checks authentication status using Supabase
- Protects routes: `/templates`, `/designs`
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`

#### 2. Login Page (`src/app/login/page.tsx`)

- Client component with email/password form
- Uses `getSupabaseBrowserClient()` for authentication
- Handles form submission and error display
- Redirects to original destination after successful login

#### 3. Navigation Bar (`src/components/layout/NavBar.tsx`)

- Client component that displays auth state
- Shows user email when logged in
- Provides logout button
- Hides protected links when not authenticated
- Listens to auth state changes in real-time

#### 4. Supabase Helpers

**Client-side** (`src/lib/supabaseClient.ts`):
- `createSupabaseBrowserClient()` - Creates browser client
- `getSupabaseBrowserClient()` - Singleton instance

**Server-side** (`src/server/supabase.ts`):
- `createSupabaseServerClient()` - For server components/API routes
- `createSupabaseAdminClient()` - For admin operations (bypasses RLS)

## Usage Examples

### Checking Auth in Client Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

export function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <div>User: {user?.email}</div>;
}
```

### Checking Auth in Server Components

```typescript
import { createSupabaseServerClient } from '@/server/supabase';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Welcome, {user.email}!</div>;
}
```

## Protected Routes

The following routes are protected by middleware:

- `/templates` - Templates list and management
- `/templates/new` - Create new template
- `/templates/[id]` - Template editor
- `/designs` - Designs list and management

Attempting to access these routes without authentication will redirect to `/login` with a `redirectTo` parameter.

## Security Considerations

### Current Implementation

✅ **Implemented**:
- Email/password authentication
- Protected routes via middleware
- Session management with cookies
- Automatic session refresh
- Secure logout

⚠️ **Not Yet Implemented** (for production):
- Email verification
- Password reset flow
- Row Level Security (RLS) policies
- Rate limiting on login attempts
- Multi-factor authentication (MFA)
- OAuth providers (Google, GitHub, etc.)

### Recommendations for Production

1. **Enable Email Verification**: Require users to verify their email before accessing the app
2. **Implement RLS**: Add Row Level Security policies to your Supabase tables
3. **Add Password Reset**: Implement forgot password functionality
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **HTTPS Only**: Ensure your app is served over HTTPS in production
6. **Secure Cookies**: Configure secure cookie settings in production

## Testing the Authentication

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Try accessing a protected route**:
   - Navigate to `http://localhost:3000/templates`
   - You should be redirected to `/login`

3. **Log in with test credentials**:
   - Enter the email and password of a user you created in Supabase
   - Click "Log in"
   - You should be redirected back to `/templates`

4. **Verify session persistence**:
   - Refresh the page
   - You should remain logged in

5. **Test logout**:
   - Click the "Log out" button in the navigation
   - You should be redirected to `/login`
   - Try accessing `/templates` again - you should be redirected to login

## Troubleshooting

### "Missing Supabase environment variables" Error

- Ensure `.env.local` exists and contains the correct values
- Restart the development server after adding environment variables

### Login Not Working

- Check that the user exists in Supabase Auth
- Verify the email and password are correct
- Check browser console for error messages
- Ensure Supabase URL and anon key are correct

### Infinite Redirect Loop

- Clear browser cookies and local storage
- Check middleware configuration
- Verify Supabase client is properly initialized

### Session Not Persisting

- Check that cookies are enabled in your browser
- Verify middleware is properly handling cookie updates
- Check Supabase project settings for session timeout configuration

