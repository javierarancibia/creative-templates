// Canvas-related types
export interface CanvasLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface TextLayer extends CanvasLayer {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageLayer extends CanvasLayer {
  type: 'image';
  src: string;
  alt?: string;
}

export interface ShapeLayer extends CanvasLayer {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer;

export interface CanvasState {
  layers: Layer[];
  selectedLayerId: string | null;
  width: number;
  height: number;
  backgroundColor: string;
}

