# Supabase Setup Guide

This document explains how to set up and use Supabase in the Creative Templates App.

## Prerequisites

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings

## Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. (Optional) For admin operations, add the service role key:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
   ⚠️ **WARNING**: Never expose the service role key to the client!

## Usage

### Client-Side (Browser Components)

Use the browser client in client components:

```typescript
'use client';

import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

export function MyComponent() {
  const supabase = getSupabaseBrowserClient();
  
  // Use supabase client
  const { data, error } = await supabase
    .from('templates')
    .select('*');
}
```

### Server-Side (Server Components & API Routes)

Use the server client in server components and API routes:

```typescript
import { createSupabaseServerClient } from '@/server/supabase';

export async function MyServerComponent() {
  const supabase = await createSupabaseServerClient();
  
  // Use supabase client
  const { data, error } = await supabase
    .from('templates')
    .select('*');
}
```

### Admin Operations (Server-Side Only)

For operations that need to bypass Row Level Security (RLS):

```typescript
import { createSupabaseAdminClient } from '@/server/supabase';

export async function adminOperation() {
  const supabase = createSupabaseAdminClient();
  
  // This bypasses RLS - use with caution!
  const { data, error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId);
}
```

## Current Limitations

⚠️ **Important Notes**:

1. **No Authentication**: Currently, the app uses the anon key without user authentication
2. **No RLS**: Row Level Security is not configured - all data is publicly accessible
3. **Development Only**: This setup is for development/testing purposes

## Next Steps

To make this production-ready, you should:

1. Set up Supabase Auth for user authentication
2. Configure Row Level Security (RLS) policies on your tables
3. Implement proper authorization checks
4. Add middleware to refresh user sessions
5. Handle authentication state in the UI

## Database Schema

You'll need to create the following tables in your Supabase project:

### Templates Table
```sql
create table templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  thumbnail text,
  status text check (status in ('draft', 'published', 'archived')),
  canvas_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Designs Table
```sql
create table designs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  template_id uuid references templates(id),
  thumbnail text,
  canvas_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Error Handling

The Supabase clients will throw descriptive errors if environment variables are missing:

```
Missing Supabase environment variables.
Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.
See .env.local.example for reference.
```

Make sure to set up your `.env.local` file before running the app!

