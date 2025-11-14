import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TemplateList } from '@/features/templates/components/TemplateList';

export default function TemplatesPage() {
  // TODO: Fetch templates from API
  const templates = [];

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

      <TemplateList templates={templates} />
    </div>
  );
}

