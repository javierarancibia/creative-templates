// Client-side Supabase client for use in browser/client components
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client for use in client components
 * Uses NEXT_PUBLIC_* environment variables that are exposed to the browser
 *
 * @throws {Error} If required environment variables are missing
 * @returns {SupabaseClient} Configured Supabase client instance
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file. ' +
      'See .env.local.example for reference.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Export a singleton instance for convenience
// Note: This will throw an error if env vars are not set
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
}

