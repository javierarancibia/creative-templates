'use client';

import Link from 'next/link';
import { Design } from '../types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CanvasPreview } from '@/features/canvas/components/CanvasPreview';

interface DesignListProps {
  designs: Design[];
}

export function DesignList({ designs }: DesignListProps) {
  if (designs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 bg-gray-50 rounded-3xl mb-6">
          <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No designs yet</h3>
        <p className="text-gray-500 text-lg">Create your first design from a template!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {designs.map((design) => (
        <Link key={design.id} href={`/designs/${design.id}`} className="group">
          <Card className="cursor-pointer h-full overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="relative overflow-hidden">
              <CanvasPreview
                canvas={design.canvas}
                className="aspect-video rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#5222DB] transition-colors line-clamp-1">
                  {design.name}
                </h3>
                <Badge variant={design.status === 'active' ? 'success' : design.status === 'archived' ? 'warning' : 'default'}>
                  {design.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="capitalize">{design.channel}</Badge>
                <span className="text-gray-400 text-xs font-medium">
                  {new Date(design.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

