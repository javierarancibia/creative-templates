import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DesignList } from '@/features/designs/components/DesignList';

export default function DesignsPage() {
  // TODO: Fetch designs from API
  const designs: [] = [];

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
          <Button variant="primary">
            Create from Template
          </Button>
        </Link>
      </div>

      <DesignList designs={designs} />
    </div>
  );
}

