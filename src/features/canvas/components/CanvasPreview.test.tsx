import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasPreview } from './CanvasPreview';
import { CanvasState, createEmptyCanvas } from '../canvasTypes';

describe('CanvasPreview', () => {
  it('renders "No preview" when canvas is null', () => {
    render(<CanvasPreview canvas={null} />);
    expect(screen.getByText('No preview')).toBeInTheDocument();
  });

  it('renders "No preview" when canvas has no layers', () => {
    const emptyCanvas = createEmptyCanvas();
    render(<CanvasPreview canvas={emptyCanvas} />);
    expect(screen.getByText('No preview')).toBeInTheDocument();
  });

  it('renders canvas with text layer', () => {
    const canvas: CanvasState = {
      width: 1080,
      height: 1080,
      backgroundColor: '#ffffff',
      layers: [
        {
          id: 'text-1',
          type: 'text',
          x: 100,
          y: 100,
          width: 300,
          height: 100,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          text: 'Hello World',
          fontSize: 24,
          color: '#000000',
          textAlign: 'left',
        },
      ],
      selectedLayerId: null,
    };

    render(<CanvasPreview canvas={canvas} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders canvas with image layer', () => {
    const canvas: CanvasState = {
      width: 1080,
      height: 1080,
      backgroundColor: '#ffffff',
      layers: [
        {
          id: 'image-1',
          type: 'image',
          x: 0,
          y: 0,
          width: 500,
          height: 500,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          src: 'https://via.placeholder.com/500',
          fit: 'cover',
        },
      ],
      selectedLayerId: null,
    };

    render(<CanvasPreview canvas={canvas} />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/500');
  });

  it('renders multiple layers in correct z-index order', () => {
    const canvas: CanvasState = {
      width: 1080,
      height: 1080,
      backgroundColor: '#f0f0f0',
      layers: [
        {
          id: 'text-2',
          type: 'text',
          x: 200,
          y: 200,
          width: 200,
          height: 50,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          text: 'Top Layer',
          fontSize: 20,
          color: '#ff0000',
          textAlign: 'center',
        },
        {
          id: 'text-1',
          type: 'text',
          x: 100,
          y: 100,
          width: 200,
          height: 50,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          text: 'Bottom Layer',
          fontSize: 20,
          color: '#0000ff',
          textAlign: 'left',
        },
      ],
      selectedLayerId: null,
    };

    render(<CanvasPreview canvas={canvas} />);
    expect(screen.getByText('Top Layer')).toBeInTheDocument();
    expect(screen.getByText('Bottom Layer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const canvas: CanvasState = {
      width: 1080,
      height: 1080,
      backgroundColor: '#ffffff',
      layers: [
        {
          id: 'text-1',
          type: 'text',
          x: 0,
          y: 0,
          width: 100,
          height: 50,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          text: 'Test',
          fontSize: 16,
          color: '#000000',
          textAlign: 'left',
        },
      ],
      selectedLayerId: null,
    };

    const { container } = render(<CanvasPreview canvas={canvas} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

