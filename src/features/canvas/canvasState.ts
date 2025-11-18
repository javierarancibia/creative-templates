// Pure state helpers & reducer-style functions for canvas
import { CanvasState, Layer, TextLayer, ImageLayer, createEmptyCanvas } from './canvasTypes';

/**
 * Initial canvas state using createEmptyCanvas helper
 */
export const initialCanvasState: CanvasState = createEmptyCanvas();

/**
 * Generates a unique ID for layers
 */
function generateLayerId(): string {
  return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Gets the next zIndex value for a new layer
 */
function getNextZIndex(state: CanvasState): number {
  if (state.layers.length === 0) return 0;
  return Math.max(...state.layers.map(l => l.zIndex)) + 1;
}

/**
 * Adds a new text layer to the canvas
 * @param state - Current canvas state
 * @param initial - Optional initial properties for the text layer
 * @returns New canvas state with the text layer added
 */
export function addTextLayer(
  state: CanvasState,
  initial?: Partial<TextLayer>
): CanvasState {
  const newLayer: TextLayer = {
    id: initial?.id || generateLayerId(),
    type: 'text',
    x: initial?.x ?? state.width / 2 - 100,
    y: initial?.y ?? state.height / 2 - 25,
    width: initial?.width ?? 200,
    height: initial?.height ?? 50,
    rotation: initial?.rotation ?? 0,
    opacity: initial?.opacity ?? 1,
    zIndex: initial?.zIndex ?? getNextZIndex(state),
    text: initial?.text ?? 'New Text',
    fontSize: initial?.fontSize ?? 24,
    fontWeight: initial?.fontWeight ?? 'normal',
    color: initial?.color ?? '#000000',
    textAlign: initial?.textAlign ?? 'left',
  };

  return {
    ...state,
    layers: [...state.layers, newLayer],
    selectedLayerId: newLayer.id,
  };
}

/**
 * Adds a new image layer to the canvas
 * @param state - Current canvas state
 * @param initial - Optional initial properties for the image layer
 * @returns New canvas state with the image layer added
 */
export function addImageLayer(
  state: CanvasState,
  initial?: Partial<ImageLayer>
): CanvasState {
  const newLayer: ImageLayer = {
    id: initial?.id || generateLayerId(),
    type: 'image',
    x: initial?.x ?? state.width / 2 - 150,
    y: initial?.y ?? state.height / 2 - 150,
    width: initial?.width ?? 300,
    height: initial?.height ?? 300,
    rotation: initial?.rotation ?? 0,
    opacity: initial?.opacity ?? 1,
    zIndex: initial?.zIndex ?? getNextZIndex(state),
    src: initial?.src ?? '',
    fit: initial?.fit ?? 'contain',
  };

  return {
    ...state,
    layers: [...state.layers, newLayer],
    selectedLayerId: newLayer.id,
  };
}

/**
 * Updates a layer with partial properties
 * @param state - Current canvas state
 * @param layerId - ID of the layer to update
 * @param patch - Partial layer properties to update
 * @returns New canvas state with the layer updated
 */
export function updateLayer(
  state: CanvasState,
  layerId: string,
  patch: Partial<Omit<Layer, 'type'>>
): CanvasState {
  return {
    ...state,
    layers: state.layers.map(layer =>
      layer.id === layerId ? { ...layer, ...patch } as Layer : layer
    ),
  };
}

/**
 * Deletes a layer from the canvas
 * @param state - Current canvas state
 * @param layerId - ID of the layer to delete
 * @returns New canvas state with the layer removed
 */
export function deleteLayer(state: CanvasState, layerId: string): CanvasState {
  return {
    ...state,
    layers: state.layers.filter(layer => layer.id !== layerId),
    selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId,
  };
}

/**
 * Selects a layer
 * @param state - Current canvas state
 * @param layerId - ID of the layer to select, or null to deselect
 * @returns New canvas state with the layer selected
 */
export function selectLayer(
  state: CanvasState,
  layerId: string | null
): CanvasState {
  return {
    ...state,
    selectedLayerId: layerId,
  };
}

/**
 * Brings a layer forward in the z-order
 * @param state - Current canvas state
 * @param layerId - ID of the layer to bring forward
 * @returns New canvas state with the layer's zIndex increased
 */
export function bringLayerForward(
  state: CanvasState,
  layerId: string
): CanvasState {
  const layer = state.layers.find(l => l.id === layerId);
  if (!layer) return state;

  // Find the next higher zIndex
  const higherLayers = state.layers.filter(l => l.zIndex > layer.zIndex);
  if (higherLayers.length === 0) return state; // Already at the top

  const nextZIndex = Math.min(...higherLayers.map(l => l.zIndex));

  // Swap zIndex values
  return {
    ...state,
    layers: state.layers.map(l => {
      if (l.id === layerId) return { ...l, zIndex: nextZIndex };
      if (l.zIndex === nextZIndex) return { ...l, zIndex: layer.zIndex };
      return l;
    }),
  };
}

/**
 * Sends a layer backward in the z-order
 * @param state - Current canvas state
 * @param layerId - ID of the layer to send backward
 * @returns New canvas state with the layer's zIndex decreased
 */
export function sendLayerBackward(
  state: CanvasState,
  layerId: string
): CanvasState {
  const layer = state.layers.find(l => l.id === layerId);
  if (!layer) return state;

  // Find the next lower zIndex
  const lowerLayers = state.layers.filter(l => l.zIndex < layer.zIndex);
  if (lowerLayers.length === 0) return state; // Already at the bottom

  const prevZIndex = Math.max(...lowerLayers.map(l => l.zIndex));

  // Swap zIndex values
  return {
    ...state,
    layers: state.layers.map(l => {
      if (l.id === layerId) return { ...l, zIndex: prevZIndex };
      if (l.zIndex === prevZIndex) return { ...l, zIndex: layer.zIndex };
      return l;
    }),
  };
}

/**
 * Nudges a layer by a delta amount
 * @param state - Current canvas state
 * @param layerId - ID of the layer to nudge
 * @param dx - Delta x (horizontal movement)
 * @param dy - Delta y (vertical movement)
 * @returns New canvas state with the layer moved
 */
export function nudgeLayer(
  state: CanvasState,
  layerId: string,
  dx: number,
  dy: number
): CanvasState {
  return updateLayer(state, layerId, {
    x: (state.layers.find(l => l.id === layerId)?.x ?? 0) + dx,
    y: (state.layers.find(l => l.id === layerId)?.y ?? 0) + dy,
  });
}

/**
 * Snaps a layer to the nearest canvas edge or center line
 * @param state - Current canvas state
 * @param layerId - ID of the layer to snap
 * @param threshold - Snap threshold in pixels (default: 10)
 * @returns New canvas state with the layer snapped
 */
export function snapLayerToCanvas(
  state: CanvasState,
  layerId: string,
  threshold = 10
): CanvasState {
  const layer = state.layers.find(l => l.id === layerId);
  if (!layer) return state;

  let newX = layer.x;
  let newY = layer.y;

  // Calculate layer center
  const layerCenterX = layer.x + layer.width / 2;
  const layerCenterY = layer.y + layer.height / 2;

  // Canvas center
  const canvasCenterX = state.width / 2;
  const canvasCenterY = state.height / 2;

  // Snap to horizontal center
  if (Math.abs(layerCenterX - canvasCenterX) < threshold) {
    newX = canvasCenterX - layer.width / 2;
  }
  // Snap to left edge
  else if (Math.abs(layer.x) < threshold) {
    newX = 0;
  }
  // Snap to right edge
  else if (Math.abs(layer.x + layer.width - state.width) < threshold) {
    newX = state.width - layer.width;
  }

  // Snap to vertical center
  if (Math.abs(layerCenterY - canvasCenterY) < threshold) {
    newY = canvasCenterY - layer.height / 2;
  }
  // Snap to top edge
  else if (Math.abs(layer.y) < threshold) {
    newY = 0;
  }
  // Snap to bottom edge
  else if (Math.abs(layer.y + layer.height - state.height) < threshold) {
    newY = state.height - layer.height;
  }

  if (newX !== layer.x || newY !== layer.y) {
    return updateLayer(state, layerId, { x: newX, y: newY });
  }

  return state;
}

