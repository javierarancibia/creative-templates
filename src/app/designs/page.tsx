'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DesignList } from '@/features/designs/components/DesignList';
import { Design } from '@/features/designs/types';
import { fetchDesigns } from '@/features/designs/api';

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDesigns() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDesigns();
        setDesigns(data);
      } catch (err) {
        console.error('Error loading designs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load designs');
      } finally {
        setLoading(false);
      }
    }

    loadDesigns();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="container py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Designs
            </h1>
            <p className="text-lg text-gray-600">
              View and manage your creative designs
            </p>
          </div>
          <Link href="/templates">
            <Button variant="outline" className="shadow-md">
              Browse Templates
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#5222DB] mb-4"></div>
            <p className="text-gray-500 font-medium">Loading designs...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-red-50 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && <DesignList designs={designs} />}
      </div>
    </div>
  );
}

