'use client';

import { Layer } from '../canvasTypes';
import { Input } from '@/components/ui/Input';

interface PropertyPanelProps {
  selectedLayer: Layer | null;
  onLayerUpdate?: (updates: Partial<Layer>) => void;
}

export function PropertyPanel({ selectedLayer, onLayerUpdate }: PropertyPanelProps) {
  if (!selectedLayer) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold mb-3">Properties</h3>
        <p className="text-gray-500 text-sm">Select a layer to edit properties</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold mb-3">Properties</h3>
      <div className="space-y-3">
        <Input
          label="Name"
          value={selectedLayer.name}
          onChange={(e) => onLayerUpdate?.({ name: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="X"
            type="number"
            value={selectedLayer.x}
            onChange={(e) => onLayerUpdate?.({ x: Number(e.target.value) })}
          />
          <Input
            label="Y"
            type="number"
            value={selectedLayer.y}
            onChange={(e) => onLayerUpdate?.({ y: Number(e.target.value) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Width"
            type="number"
            value={selectedLayer.width}
            onChange={(e) => onLayerUpdate?.({ width: Number(e.target.value) })}
          />
          <Input
            label="Height"
            type="number"
            value={selectedLayer.height}
            onChange={(e) => onLayerUpdate?.({ height: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

