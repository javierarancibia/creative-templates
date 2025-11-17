// Canvas-related types

/**
 * Supported layer types
 */
export type LayerType = 'text' | 'image';

/**
 * Base properties shared by all layer types
 */
export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number; // position x
  y: number; // position y
  width: number;
  height: number;
  rotation: number; // degrees
  opacity: number; // 0-1
  zIndex: number;
}

/**
 * Text layer with typography properties
 */
export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontWeight?: 'normal' | 'bold';
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

/**
 * Image layer with source and fit properties
 */
export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  fit: 'contain' | 'cover' | 'fill';
}

/**
 * Union type of all layer types
 */
export type Layer = TextLayer | ImageLayer;

/**
 * Canvas state containing all layers and canvas properties
 */
export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  layers: Layer[];
  selectedLayerId?: string | null;
}

/**
 * Creates an empty canvas with default dimensions
 * @param width - Canvas width (default: 1080)
 * @param height - Canvas height (default: 1080)
 * @param backgroundColor - Background color (default: '#ffffff')
 * @returns Empty canvas state
 */
export function createEmptyCanvas(
  width = 1080,
  height = 1080,
  backgroundColor = '#ffffff'
): CanvasState {
  return {
    width,
    height,
    backgroundColor,
    layers: [],
    selectedLayerId: null,
  };
}

