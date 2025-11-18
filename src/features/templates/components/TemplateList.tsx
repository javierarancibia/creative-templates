'use client';

import Link from 'next/link';
import { Template } from '../types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TemplateStatusBadge } from './TemplateStatusBadge';
import { CanvasPreview } from '@/features/canvas/components/CanvasPreview';

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 bg-gray-50 rounded-3xl mb-6">
          <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No templates yet</h3>
        <p className="text-gray-500 text-lg">Create your first template to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template) => (
        <Link key={template.id} href={`/templates/${template.id}`} className="group">
          <Card className="cursor-pointer h-full overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="relative overflow-hidden">
              <CanvasPreview
                canvas={template.canvas}
                className="aspect-video rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#5222DB] transition-colors line-clamp-1">
                  {template.name}
                </h3>
                <TemplateStatusBadge status={template.status} />
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="capitalize">{template.channel}</Badge>
                <span className="text-gray-400 text-xs font-medium">
                  {formatDate(template.updatedAt)}
                </span>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

