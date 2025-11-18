'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import type { User } from '@supabase/supabase-js';

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-[#5222DB] to-[#7c3aed] bg-clip-text text-transparent transition-all cursor-pointer hover:scale-105"
          >
            Creative Templates
          </Link>
          <div className="flex items-center gap-8">
            {user && (
              <>
                <Link
                  href="/templates"
                  className={`font-semibold transition-all cursor-pointer hover:text-[#5222DB] relative group ${
                    pathname?.startsWith('/templates') ? '' : 'text-gray-600'
                  }`}
                  style={pathname?.startsWith('/templates') ? { color: '#5222DB' } : undefined}
                >
                  Templates
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#5222DB] transition-transform ${
                    pathname?.startsWith('/templates') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
                <Link
                  href="/designs"
                  className={`font-semibold transition-all cursor-pointer hover:text-[#5222DB] relative group ${
                    pathname?.startsWith('/designs') ? '' : 'text-gray-600'
                  }`}
                  style={pathname?.startsWith('/designs') ? { color: '#5222DB' } : undefined}
                >
                  Designs
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#5222DB] transition-transform ${
                    pathname?.startsWith('/designs') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              </>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </div>
                ) : (
                  pathname !== '/login' && (
                    <Link href="/login">
                      <Button variant="primary" size="sm">
                        Log in
                      </Button>
                    </Link>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

