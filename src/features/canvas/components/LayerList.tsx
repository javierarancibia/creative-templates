'use client';

import { Layer } from '../canvasTypes';

interface LayerListProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerDelete?: (layerId: string) => void;
}

export function LayerList({ layers, selectedLayerId, onLayerSelect }: LayerListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold mb-3">Layers</h3>
      {layers.length === 0 ? (
        <p className="text-gray-500 text-sm">No layers yet</p>
      ) : (
        <div className="space-y-2">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-2 rounded cursor-pointer ${
                selectedLayerId === layer.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{layer.name}</span>
                <span className="text-xs text-gray-500">{layer.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

