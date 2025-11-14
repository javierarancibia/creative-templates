'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Template } from '../types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No templates found. Create your first template!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Link key={template.id} href={`/templates/${template.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardBody>
              <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
                {template.thumbnail ? (
                  <Image src={template.thumbnail} alt={template.name} fill className="object-cover" />
                ) : (
                  <span className="text-gray-400">No preview</span>
                )}
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <TemplateStatusBadge status={template.status} />
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function TemplateStatusBadge({ status }: { status: Template['status'] }) {
  const variantMap = {
    draft: 'default' as const,
    published: 'success' as const,
    archived: 'warning' as const,
  };

  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

