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
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Designs</h1>
          <p className="text-gray-600">
            View and manage your creative designs
          </p>
        </div>
        <Link href="/templates">
          <Button variant="outline">
            Browse Templates
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading designs...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && <DesignList designs={designs} />}
    </div>
  );
}

