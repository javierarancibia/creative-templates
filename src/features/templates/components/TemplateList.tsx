'use client';

import Link from 'next/link';
import { Template } from '../types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TemplateStatusBadge } from './TemplateStatusBadge';

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
                <span className="text-gray-400">Canvas Preview</span>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <TemplateStatusBadge status={template.status} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">{template.channel}</Badge>
                <span className="text-gray-500 text-xs">
                  {new Date(template.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

