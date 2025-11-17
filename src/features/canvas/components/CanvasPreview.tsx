'use client';

import { CanvasState, Layer, TextLayer, ImageLayer } from '../canvasTypes';

interface CanvasPreviewProps {
  canvas: CanvasState | null;
  className?: string;
}

/**
 * CanvasPreview - Renders a static, scaled-down preview of a canvas
 * Used in list views to show thumbnails of templates and designs
 */
export function CanvasPreview({ canvas, className = '' }: CanvasPreviewProps) {
  if (!canvas || canvas.layers.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-400 text-sm">No preview</span>
      </div>
    );
  }

  // Calculate scale to fit the preview container
  // Assuming container is aspect-video (16:9), we'll scale the canvas to fit
  const containerWidth = 400; // Reference width for scaling
  const containerHeight = 225; // Reference height for aspect-video (16:9)
  
  const scaleX = containerWidth / canvas.width;
  const scaleY = containerHeight / canvas.height;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = canvas.width * scale;
  const scaledHeight = canvas.height * scale;

  // Sort layers by zIndex for proper rendering order
  console.log('Layers:', canvas.layers)
  const sortedLayers = [...canvas.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: '#2d436eff' }}
    >
      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          backgroundColor: canvas.backgroundColor,
          position: 'relative',
          transformOrigin: 'top left',
        }}
      >
        {sortedLayers.map((layer) => (
          <PreviewLayer key={layer.id} layer={layer} scale={scale} />
        ))}
      </div>
    </div>
  );
}

interface PreviewLayerProps {
  layer: Layer;
  scale: number;
}

function PreviewLayer({ layer, scale }: PreviewLayerProps) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${layer.x * scale}px`,
    top: `${layer.y * scale}px`,
    width: `${layer.width * scale}px`,
    height: `${layer.height * scale}px`,
    opacity: layer.opacity,
    transform: `rotate(${layer.rotation}deg)`,
    transformOrigin: 'center',
    pointerEvents: 'none', // Preview is non-interactive
  };

  if (layer.type === 'text') {
    return <TextPreviewLayer layer={layer} style={baseStyle} scale={scale} />;
  } else if (layer.type === 'image') {
    return <ImagePreviewLayer layer={layer} style={baseStyle} />;
  }

  return null;
}

interface TextPreviewLayerProps {
  layer: TextLayer;
  style: React.CSSProperties;
  scale: number;
}

function TextPreviewLayer({ layer, style, scale }: TextPreviewLayerProps) {
  return (
    <div
      style={{
        ...style,
        color: layer.color,
        fontSize: `${layer.fontSize * scale}px`,
        fontWeight: layer.fontWeight || 'normal',
        textAlign: layer.textAlign,
        display: 'flex',
        alignItems: 'center',
        justifyContent: layer.textAlign === 'center' ? 'center' : layer.textAlign === 'right' ? 'flex-end' : 'flex-start',
        overflow: 'hidden',
        wordBreak: 'break-word',
        lineHeight: 1.2,
      }}
    >
      {layer.text}
    </div>
  );
}

interface ImagePreviewLayerProps {
  layer: ImageLayer;
  style: React.CSSProperties;
}

function ImagePreviewLayer({ layer, style }: ImagePreviewLayerProps) {
  return (
    <div style={style}>
      <img
        src={layer.src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: layer.fit,
        }}
      />
    </div>
  );
}

