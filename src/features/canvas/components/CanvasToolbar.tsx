'use client';

import { CanvasState } from '../canvasTypes';
import { addTextLayer, addImageLayer, deleteLayer, snapLayerToCanvas } from '../canvasState';

interface CanvasToolbarProps {
  canvas: CanvasState;
  onChange: (next: CanvasState) => void;
}

export function CanvasToolbar({ canvas, onChange }: CanvasToolbarProps) {
  const handleAddTextLayer = () => {
    onChange(addTextLayer(canvas));
  };

  const handleAddImageLayer = () => {
    onChange(addImageLayer(canvas, { src: 'https://media.s-bol.com/BjxlxzNlo4jY/5y8rqRA/752x1200.jpg' }));
  };

  const handleDeleteSelected = () => {
    if (canvas.selectedLayerId) {
      onChange(deleteLayer(canvas, canvas.selectedLayerId));
    }
  };

  const handleSnapToCanvas = () => {
    if (canvas.selectedLayerId) {
      onChange(snapLayerToCanvas(canvas, canvas.selectedLayerId));
    }
  };

  const hasSelection = canvas.selectedLayerId !== null && canvas.selectedLayerId !== undefined;

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200">
      <button
        onClick={handleAddTextLayer}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        title="Add text layer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        Add Text
      </button>

      <button
        onClick={handleAddImageLayer}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
        title="Add image layer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add Image
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        onClick={handleDeleteSelected}
        disabled={!hasSelection}
        className="px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        title="Delete selected layer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>

      <button
        onClick={handleSnapToCanvas}
        disabled={!hasSelection}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        title="Snap to canvas edges/center"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        Snap
      </button>

      <div className="flex-1" />

      <div className="text-sm text-gray-500">
        {canvas.layers.length} layer{canvas.layers.length !== 1 ? 's' : ''}
        {hasSelection && ' • 1 selected'}
      </div>
    </div>
  );
}
