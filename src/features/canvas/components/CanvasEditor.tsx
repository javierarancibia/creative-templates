'use client';

import { useState, useEffect, useCallback } from 'react';
import { CanvasState } from '../canvasTypes';
import { nudgeLayer, selectLayer, bringLayerForward, sendLayerBackward } from '../canvasState';
import { Canvas } from './Canvas';
import { CanvasToolbar } from './CanvasToolbar';
import { LayerList } from './LayerList';
import { PropertyPanel } from './PropertyPanel';

interface CanvasEditorProps {
  initialCanvas: CanvasState;
  onSave?: (canvas: CanvasState) => void;
  onCanvasChange?: (canvas: CanvasState) => void;
}

export function CanvasEditor({ initialCanvas, onSave, onCanvasChange }: CanvasEditorProps) {
  const [canvas, setCanvas] = useState<CanvasState>(initialCanvas);
  const [hasChanges, setHasChanges] = useState(false);

  const handleCanvasChange = useCallback((next: CanvasState) => {
    setCanvas(next);
    setHasChanges(true);
    // Notify parent of canvas changes
    if (onCanvasChange) {
      onCanvasChange(next);
    }
  }, [onCanvasChange]);

  const handleSave = () => {
    if (onSave) {
      onSave(canvas);
      setHasChanges(false);
    }
  };

  const handleReorder = (layerId: string, direction: 'up' | 'down') => {
    const newCanvas = direction === 'up' 
      ? bringLayerForward(canvas, layerId)
      : sendLayerBackward(canvas, layerId);
    handleCanvasChange(newCanvas);
  };

  const handleSelect = (layerId: string) => {
    handleCanvasChange(selectLayer(canvas, layerId));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!canvas.selectedLayerId) return;

      const nudgeAmount = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleCanvasChange(nudgeLayer(canvas, canvas.selectedLayerId, 0, -nudgeAmount));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleCanvasChange(nudgeLayer(canvas, canvas.selectedLayerId, 0, nudgeAmount));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleCanvasChange(nudgeLayer(canvas, canvas.selectedLayerId, -nudgeAmount, 0));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleCanvasChange(nudgeLayer(canvas, canvas.selectedLayerId, nudgeAmount, 0));
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          // Delete is handled by toolbar button
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canvas, handleCanvasChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <CanvasToolbar canvas={canvas} onChange={handleCanvasChange} />

      {/* Main editor area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 overflow-auto">
          <Canvas value={canvas} onChange={handleCanvasChange} />
        </div>

        {/* Right sidebar */}
        <div className="w-80 flex flex-col gap-4 overflow-auto">
          {/* Layer list */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-sm text-gray-700 uppercase">Layers</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <LayerList 
                canvas={canvas} 
                onSelect={handleSelect}
                onReorder={handleReorder}
              />
            </div>
          </div>

          {/* Property panel */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex-1">
            <div className="overflow-y-auto h-full">
              <PropertyPanel canvas={canvas} onChange={handleCanvasChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      {onSave && (
        <div className="p-4 bg-white border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-[#5222DB] rounded hover:bg-[#5222DB] disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {hasChanges ? 'Save Canvas' : 'No Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

