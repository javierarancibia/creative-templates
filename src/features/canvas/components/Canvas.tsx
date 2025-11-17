'use client';

import { Rnd } from 'react-rnd';
import { CanvasState, Layer, TextLayer, ImageLayer } from '../canvasTypes';
import { updateLayer, selectLayer } from '../canvasState';

interface CanvasProps {
  value: CanvasState;
  onChange: (next: CanvasState) => void;
}

export function Canvas({ value, onChange }: CanvasProps) {
  const handleLayerClick = (layerId: string) => {
    onChange(selectLayer(value, layerId));
  };

  const handleLayerUpdate = (
    layerId: string,
    updates: { x?: number; y?: number; width?: number; height?: number }
  ) => {
    onChange(updateLayer(value, layerId, updates));
  };

  const renderLayer = (layer: Layer) => {
    const isSelected = value.selectedLayerId === layer.id;

    return (
      <Rnd
        key={layer.id}
        position={{ x: layer.x, y: layer.y }}
        size={{ width: layer.width, height: layer.height }}
        onDragStop={(e, d) => {
          handleLayerUpdate(layer.id, { x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          handleLayerUpdate(layer.id, {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            x: position.x,
            y: position.y,
          });
        }}
        onClick={() => handleLayerClick(layer.id)}
        bounds="parent"
        style={{
          zIndex: layer.zIndex,
          opacity: layer.opacity,
          transform: `rotate(${layer.rotation}deg)`,
        }}
        className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="w-full h-full">
          {layer.type === 'text' && <TextLayerContent layer={layer} />}
          {layer.type === 'image' && <ImageLayerContent layer={layer} />}
        </div>
      </Rnd>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center p-8">
      <div
        className="relative shadow-lg overflow-hidden"
        style={{
          width: value.width,
          height: value.height,
          backgroundColor: value.backgroundColor,
        }}
        onClick={(e) => {
          // Deselect if clicking on canvas background
          if (e.target === e.currentTarget) {
            onChange(selectLayer(value, null));
          }
        }}
      >
        {value.layers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            Canvas Area ({value.width} × {value.height})
            <br />
            Add layers using the toolbar
          </div>
        )}
        {value.layers.map(renderLayer)}
      </div>
    </div>
  );
}

function TextLayerContent({ layer }: { layer: TextLayer }) {
  return (
    <div
      className="w-full h-full flex items-center cursor-move"
      style={{
        fontSize: layer.fontSize,
        fontWeight: layer.fontWeight,
        color: layer.color,
        textAlign: layer.textAlign,
        padding: '4px',
        wordWrap: 'break-word',
        overflow: 'hidden',
      }}
    >
      {layer.text || 'Empty text'}
    </div>
  );
}

function ImageLayerContent({ layer }: { layer: ImageLayer }) {
  return (
    <div className="w-full h-full cursor-move">
      {layer.src ? (
        <img
          src={layer.src}
          alt="Layer"
          className="w-full h-full pointer-events-none"
          style={{
            objectFit: layer.fit,
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          No image
        </div>
      )}
    </div>
  );
}
