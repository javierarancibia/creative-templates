'use client';

import { CanvasState, Layer } from '../canvasTypes';

interface LayerListProps {
  canvas: CanvasState;
  onSelect: (layerId: string) => void;
  onReorder: (layerId: string, direction: 'up' | 'down') => void;
}

export function LayerList({ canvas, onSelect, onReorder }: LayerListProps) {
  const sortedLayers = [...canvas.layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerName = (layer: Layer): string => {
    if (layer.type === 'text') {
      const text = layer.text.trim();
      return text.length > 20 ? `${text.substring(0, 20)}...` : text || 'Empty Text';
    }
    if (layer.type === 'image') {
      return layer.src ? 'Image Layer' : 'Empty Image';
    }
    return 'Layer';
  };

  const canMoveUp = (layer: Layer): boolean => {
    const maxZIndex = Math.max(...canvas.layers.map(l => l.zIndex));
    return layer.zIndex < maxZIndex;
  };

  const canMoveDown = (layer: Layer): boolean => {
    const minZIndex = Math.min(...canvas.layers.map(l => l.zIndex));
    return layer.zIndex > minZIndex;
  };

  if (canvas.layers.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No layers yet. Add layers using the toolbar.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {sortedLayers.map((layer) => {
        const isSelected = canvas.selectedLayerId === layer.id;

        return (
          <div
            key={layer.id}
            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'border-l-4' : ''
            }`}
            style={isSelected ? { backgroundColor: '#5222DB20', borderLeftColor: '#5222DB' } : undefined}
            onClick={() => onSelect(layer.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase">
                  {layer.type}
                </span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {getLayerName(layer)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                z-index: {layer.zIndex}
              </div>
            </div>

            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(layer.id, 'up');
                }}
                disabled={!canMoveUp(layer)}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Bring forward"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(layer.id, 'down');
                }}
                disabled={!canMoveDown(layer)}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Send backward"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
