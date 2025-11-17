import { describe, it, expect } from 'vitest';
import {
  addTextLayer,
  addImageLayer,
  updateLayer,
  deleteLayer,
  selectLayer,
  bringLayerForward,
  sendLayerBackward,
  nudgeLayer,
  snapLayerToCanvas,
} from '../canvasState';
import { createEmptyCanvas } from '../canvasTypes';

describe('canvasState', () => {
  describe('addTextLayer', () => {
    it('should add a new text layer with default values', () => {
      const state = createEmptyCanvas();
      const newState = addTextLayer(state);

      expect(newState.layers).toHaveLength(1);
      expect(newState.layers[0].type).toBe('text');
      expect(newState.layers[0].text).toBe('New Text');
      expect(newState.layers[0].fontSize).toBe(24);
      expect(newState.layers[0].color).toBe('#000000');
      expect(newState.layers[0].zIndex).toBe(0);
      expect(newState.selectedLayerId).toBe(newState.layers[0].id);
    });

    it('should add a text layer with custom initial values', () => {
      const state = createEmptyCanvas();
      const newState = addTextLayer(state, {
        text: 'Custom Text',
        fontSize: 36,
        color: '#ff0000',
        fontWeight: 'bold',
      });

      expect(newState.layers).toHaveLength(1);
      expect(newState.layers[0].text).toBe('Custom Text');
      expect(newState.layers[0].fontSize).toBe(36);
      expect(newState.layers[0].color).toBe('#ff0000');
      expect(newState.layers[0].fontWeight).toBe('bold');
    });

    it('should increment zIndex for multiple layers', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      state = addTextLayer(state);
      state = addTextLayer(state);

      expect(state.layers).toHaveLength(3);
      expect(state.layers[0].zIndex).toBe(0);
      expect(state.layers[1].zIndex).toBe(1);
      expect(state.layers[2].zIndex).toBe(2);
    });
  });

  describe('addImageLayer', () => {
    it('should add a new image layer with default values', () => {
      const state = createEmptyCanvas();
      const newState = addImageLayer(state);

      expect(newState.layers).toHaveLength(1);
      expect(newState.layers[0].type).toBe('image');
      expect(newState.layers[0].src).toBe('');
      expect(newState.layers[0].fit).toBe('contain');
      expect(newState.layers[0].zIndex).toBe(0);
      expect(newState.selectedLayerId).toBe(newState.layers[0].id);
    });

    it('should add an image layer with custom initial values', () => {
      const state = createEmptyCanvas();
      const newState = addImageLayer(state, {
        src: 'https://example.com/image.jpg',
        fit: 'cover',
        width: 500,
        height: 500,
      });

      expect(newState.layers).toHaveLength(1);
      expect(newState.layers[0].src).toBe('https://example.com/image.jpg');
      expect(newState.layers[0].fit).toBe('cover');
      expect(newState.layers[0].width).toBe(500);
      expect(newState.layers[0].height).toBe(500);
    });
  });

  describe('updateLayer', () => {
    it('should update layer position', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      const layerId = state.layers[0].id;

      const newState = updateLayer(state, layerId, { x: 100, y: 200 });

      expect(newState.layers[0].x).toBe(100);
      expect(newState.layers[0].y).toBe(200);
    });

    it('should update layer properties without affecting other layers', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { text: 'Layer 1' });
      state = addTextLayer(state, { text: 'Layer 2' });
      const layer1Id = state.layers[0].id;

      const newState = updateLayer(state, layer1Id, { x: 50, y: 50 });

      expect(newState.layers[0].x).toBe(50);
      expect(newState.layers[0].y).toBe(50);
      expect(newState.layers[1].x).not.toBe(50); // Layer 2 unchanged
    });

    it('should update text layer specific properties', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      const layerId = state.layers[0].id;

      const newState = updateLayer(state, layerId, {
        text: 'Updated Text',
        fontSize: 48,
        color: '#00ff00',
      });

      const layer = newState.layers[0];
      if (layer.type === 'text') {
        expect(layer.text).toBe('Updated Text');
        expect(layer.fontSize).toBe(48);
        expect(layer.color).toBe('#00ff00');
      }
    });
  });

  describe('deleteLayer', () => {
    it('should remove a layer from the canvas', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      const layerId = state.layers[0].id;

      const newState = deleteLayer(state, layerId);

      expect(newState.layers).toHaveLength(0);
    });

    it('should deselect layer if deleted layer was selected', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      const layerId = state.layers[0].id;

      expect(state.selectedLayerId).toBe(layerId);

      const newState = deleteLayer(state, layerId);

      expect(newState.selectedLayerId).toBeNull();
    });
  });

  describe('selectLayer', () => {
    it('should select a layer', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);
      const layerId = state.layers[0].id;
      state = selectLayer(state, null); // Deselect first

      const newState = selectLayer(state, layerId);

      expect(newState.selectedLayerId).toBe(layerId);
    });

    it('should deselect when null is passed', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state);

      const newState = selectLayer(state, null);

      expect(newState.selectedLayerId).toBeNull();
    });
  });

  describe('bringLayerForward', () => {
    it('should bring a layer forward in z-order', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { text: 'Layer 1' }); // zIndex 0
      state = addTextLayer(state, { text: 'Layer 2' }); // zIndex 1
      state = addTextLayer(state, { text: 'Layer 3' }); // zIndex 2

      const layer1Id = state.layers[0].id;
      const layer2Id = state.layers[1].id;

      // Bring layer 1 forward (should swap with layer 2)
      const newState = bringLayerForward(state, layer1Id);

      const layer1 = newState.layers.find(l => l.id === layer1Id);
      const layer2 = newState.layers.find(l => l.id === layer2Id);

      expect(layer1?.zIndex).toBe(1);
      expect(layer2?.zIndex).toBe(0);
    });

    it('should not change state if layer is already at the top', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { text: 'Layer 1' });
      state = addTextLayer(state, { text: 'Layer 2' });

      const layer2Id = state.layers[1].id;

      const newState = bringLayerForward(state, layer2Id);

      expect(newState).toBe(state); // Should return same state
    });
  });

  describe('sendLayerBackward', () => {
    it('should send a layer backward in z-order', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { text: 'Layer 1' }); // zIndex 0
      state = addTextLayer(state, { text: 'Layer 2' }); // zIndex 1
      state = addTextLayer(state, { text: 'Layer 3' }); // zIndex 2

      const layer2Id = state.layers[1].id;
      const layer3Id = state.layers[2].id;

      // Send layer 3 backward (should swap with layer 2)
      const newState = sendLayerBackward(state, layer3Id);

      const layer2 = newState.layers.find(l => l.id === layer2Id);
      const layer3 = newState.layers.find(l => l.id === layer3Id);

      expect(layer3?.zIndex).toBe(1);
      expect(layer2?.zIndex).toBe(2);
    });

    it('should not change state if layer is already at the bottom', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { text: 'Layer 1' });
      state = addTextLayer(state, { text: 'Layer 2' });

      const layer1Id = state.layers[0].id;

      const newState = sendLayerBackward(state, layer1Id);

      expect(newState).toBe(state); // Should return same state
    });
  });

  describe('nudgeLayer', () => {
    it('should move a layer by delta values', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { x: 100, y: 100 });
      const layerId = state.layers[0].id;

      const newState = nudgeLayer(state, layerId, 10, -5);

      expect(newState.layers[0].x).toBe(110);
      expect(newState.layers[0].y).toBe(95);
    });

    it('should handle negative delta values', () => {
      let state = createEmptyCanvas();
      state = addTextLayer(state, { x: 100, y: 100 });
      const layerId = state.layers[0].id;

      const newState = nudgeLayer(state, layerId, -20, -30);

      expect(newState.layers[0].x).toBe(80);
      expect(newState.layers[0].y).toBe(70);
    });
  });

  describe('snapLayerToCanvas', () => {
    it('should snap layer to horizontal center', () => {
      const state = createEmptyCanvas(1000, 1000);
      let newState = addTextLayer(state, { x: 395, y: 100, width: 200, height: 50 });
      const layerId = newState.layers[0].id;

      // Layer center is at 495 (395 + 200/2), canvas center is 500
      // Difference is 5, which is less than threshold (10)
      newState = snapLayerToCanvas(newState, layerId);

      // Should snap to center: x = 500 - 200/2 = 400
      expect(newState.layers[0].x).toBe(400);
    });

    it('should snap layer to vertical center', () => {
      const state = createEmptyCanvas(1000, 1000);
      let newState = addTextLayer(state, { x: 100, y: 472, width: 200, height: 50 });
      const layerId = newState.layers[0].id;

      // Layer center is at 497 (472 + 50/2), canvas center is 500
      // Difference is 3, which is less than threshold (10)
      newState = snapLayerToCanvas(newState, layerId);

      // Should snap to center: y = 500 - 50/2 = 475
      expect(newState.layers[0].y).toBe(475);
    });

    it('should snap layer to left edge', () => {
      const state = createEmptyCanvas(1000, 1000);
      let newState = addTextLayer(state, { x: 5, y: 100, width: 200, height: 50 });
      const layerId = newState.layers[0].id;

      newState = snapLayerToCanvas(newState, layerId);

      expect(newState.layers[0].x).toBe(0);
    });

    it('should not snap if layer is too far from snap points', () => {
      const state = createEmptyCanvas(1000, 1000);
      let newState = addTextLayer(state, { x: 100, y: 100, width: 200, height: 50 });
      const layerId = newState.layers[0].id;

      const beforeSnap = newState;
      newState = snapLayerToCanvas(newState, layerId);

      expect(newState).toBe(beforeSnap); // Should return same state
    });
  });
});

