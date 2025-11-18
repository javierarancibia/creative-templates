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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 transition-colors cursor-pointer"
          >
            Creative Templates
          </Link>
          <div className="flex items-center gap-6">
            {user && (
              <>
                <Link
                  href="/templates"
                  className={`font-medium transition-colors cursor-pointer hover:text-[#5222DB] ${pathname?.startsWith('/templates') }`}
                  style={pathname?.startsWith('/templates') ? { color: '#5222DB' } : undefined}
                >
                  Templates
                </Link>
                <Link
                  href="/designs"
                  className={`font-medium transition-colors cursor-pointer hover:text-[#5222DB] ${
                    pathname?.startsWith('/designs')
                      ? ''
                      : 'text-gray-700'
                  }`}
                  style={pathname?.startsWith('/designs') ? { color: '#5222DB' } : undefined}
                >
                  Designs
                </Link>
              </>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {user.email}
                    </span>
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

