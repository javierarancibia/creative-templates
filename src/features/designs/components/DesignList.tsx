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
      <div className="text-center py-12">
        <p className="text-gray-500">No designs found. Create your first design!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <Link key={design.id} href={`/designs/${design.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardBody>
              <CanvasPreview
                canvas={design.canvas}
                className="aspect-video rounded-md mb-4"
              />
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{design.name}</h3>
                <Badge variant={design.status === 'active' ? 'success' : design.status === 'archived' ? 'warning' : 'default'}>
                  {design.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">{design.channel}</Badge>
                <span className="text-gray-500 text-xs">
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

