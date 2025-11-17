'use client';

import { CanvasState, TextLayer, ImageLayer } from '../canvasTypes';
import { updateLayer } from '../canvasState';

interface PropertyPanelProps {
  canvas: CanvasState;
  onChange: (next: CanvasState) => void;
}

export function PropertyPanel({ canvas, onChange }: PropertyPanelProps) {
  const selectedLayer = canvas.layers.find(l => l.id === canvas.selectedLayerId);

  if (!selectedLayer) {
    return (
      <div className="p-4 text-center text-gray-500">
        No layer selected
      </div>
    );
  }

  const handleUpdate = (updates: Partial<typeof selectedLayer>) => {
    onChange(updateLayer(canvas, selectedLayer.id, updates));
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase">Properties</h3>

      {/* Position */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={Math.round(selectedLayer.x)}
              onChange={(e) => handleUpdate({ x: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(selectedLayer.y)}
              onChange={(e) => handleUpdate({ y: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <input
              type="number"
              value={Math.round(selectedLayer.width)}
              onChange={(e) => handleUpdate({ width: parseFloat(e.target.value) || 1 })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(selectedLayer.height)}
              onChange={(e) => handleUpdate({ height: parseFloat(e.target.value) || 1 })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rotation</label>
        <input
          type="number"
          value={selectedLayer.rotation}
          onChange={(e) => handleUpdate({ rotation: parseFloat(e.target.value) || 0 })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="Degrees"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={selectedLayer.opacity}
          onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 text-right">{Math.round(selectedLayer.opacity * 100)}%</div>
      </div>

      {/* Text-specific properties */}
      {selectedLayer.type === 'text' && (
        <TextLayerProperties layer={selectedLayer} onUpdate={handleUpdate} />
      )}

      {/* Image-specific properties */}
      {selectedLayer.type === 'image' && (
        <ImageLayerProperties layer={selectedLayer} onUpdate={handleUpdate} />
      )}
    </div>
  );
}

function TextLayerProperties({
  layer,
  onUpdate
}: {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Text Content</label>
        <textarea
          value={layer.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Font Size</label>
        <input
          type="number"
          value={layer.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 12 })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Font Weight</label>
        <select
          value={layer.fontWeight || 'normal'}
          onChange={(e) => onUpdate({ fontWeight: e.target.value as 'normal' | 'bold' })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          value={layer.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="w-full h-10 border border-gray-300 rounded cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Text Align</label>
        <select
          value={layer.textAlign}
          onChange={(e) => onUpdate({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </>
  );
}

function ImageLayerProperties({
  layer,
  onUpdate
}: {
  layer: ImageLayer;
  onUpdate: (updates: Partial<ImageLayer>) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={layer.src}
          onChange={(e) => onUpdate({ src: e.target.value })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Fit</label>
        <select
          value={layer.fit}
          onChange={(e) => onUpdate({ fit: e.target.value as 'contain' | 'cover' | 'fill' })}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
          <option value="fill">Fill</option>
        </select>
      </div>
    </>
  );
}

