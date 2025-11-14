// Pure state helpers & reducer-style functions for canvas
import { CanvasState, Layer } from './canvasTypes';

export const initialCanvasState: CanvasState = {
  layers: [],
  selectedLayerId: null,
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
};

export function addLayer(state: CanvasState, layer: Layer): CanvasState {
  return {
    ...state,
    layers: [...state.layers, layer],
  };
}

export function removeLayer(state: CanvasState, layerId: string): CanvasState {
  return {
    ...state,
    layers: state.layers.filter(layer => layer.id !== layerId),
    selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId,
  };
}

export function updateLayer(state: CanvasState, layerId: string, updates: Partial<Layer>): CanvasState {
  return {
    ...state,
    layers: state.layers.map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    ),
  };
}

export function selectLayer(state: CanvasState, layerId: string | null): CanvasState {
  return {
    ...state,
    selectedLayerId: layerId,
  };
}

export function reorderLayer(state: CanvasState, layerId: string, newIndex: number): CanvasState {
  const layerIndex = state.layers.findIndex(layer => layer.id === layerId);
  if (layerIndex === -1) return state;

  const newLayers = [...state.layers];
  const [layer] = newLayers.splice(layerIndex, 1);
  newLayers.splice(newIndex, 0, layer);

  return {
    ...state,
    layers: newLayers,
  };
}

