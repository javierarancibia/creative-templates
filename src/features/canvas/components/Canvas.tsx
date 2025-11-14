'use client';

import { CanvasState } from '../canvasTypes';

interface CanvasProps {
  state: CanvasState;
  onLayerSelect?: (layerId: string | null) => void;
}

export function Canvas({ state }: CanvasProps) {
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-center">
      <div
        className="relative shadow-lg"
        style={{
          width: state.width,
          height: state.height,
          backgroundColor: state.backgroundColor,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Canvas Area ({state.width} × {state.height})
        </div>
        {/* TODO: Render layers */}
      </div>
    </div>
  );
}

