'use client';

import { Button } from '@/components/ui/Button';

interface CanvasToolbarProps {
  onAddText?: () => void;
  onAddImage?: () => void;
  onAddShape?: () => void;
}

export function CanvasToolbar({ onAddText, onAddImage, onAddShape }: CanvasToolbarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold mb-3">Tools</h3>
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={onAddText}>
          Add Text
        </Button>
        <Button variant="outline" className="w-full" onClick={onAddImage}>
          Add Image
        </Button>
        <Button variant="outline" className="w-full" onClick={onAddShape}>
          Add Shape
        </Button>
      </div>
    </div>
  );
}

