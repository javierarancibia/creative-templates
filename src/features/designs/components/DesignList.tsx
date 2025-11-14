'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Design } from '../types';
import { Card, CardBody } from '@/components/ui/Card';

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
              <div className="aspect-video bg-gray-100 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
                {design.thumbnail ? (
                  <Image src={design.thumbnail} alt={design.name} fill className="object-cover" />
                ) : (
                  <span className="text-gray-400">No preview</span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{design.name}</h3>
              <p className="text-gray-500 text-sm">
                Created {new Date(design.createdAt).toLocaleDateString()}
              </p>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}

