'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TemplateList } from '@/features/templates/components/TemplateList';
import { Template } from '@/features/templates/types';
import { fetchTemplates } from '@/features/templates/api';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Error loading templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">
            Create and manage your creative templates
          </p>
        </div>
        <Link href="/templates/new">
          <Button variant="primary">
            Create New Template
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && <TemplateList templates={templates} />}
    </div>
  );
}

