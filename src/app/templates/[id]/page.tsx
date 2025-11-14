'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Canvas } from '@/features/canvas/components/Canvas';
import { LayerList } from '@/features/canvas/components/LayerList';
import { PropertyPanel } from '@/features/canvas/components/PropertyPanel';
import { CanvasToolbar } from '@/features/canvas/components/CanvasToolbar';
import { AICopyHelper } from '@/features/ai-copy-helper/AICopyHelper';
import { initialCanvasState, selectLayer } from '@/features/canvas/canvasState';
import { CanvasState } from '@/features/canvas/canvasTypes';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);

  // TODO: Fetch template data from API
  const template = {
    id: templateId,
    name: 'Sample Template',
    channel: 'instagram' as const,
    status: 'draft' as const,
    canvas: initialCanvasState,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const selectedLayer = canvasState.layers.find(
    (layer) => layer.id === canvasState.selectedLayerId
  ) || null;

  const handleLayerSelect = (layerId: string | null) => {
    if (layerId) {
      setCanvasState(selectLayer(canvasState, layerId));
    }
  };

  const handleUseTemplate = () => {
    // TODO: Implement "Use this template" functionality
    console.log('Using template:', templateId);
    router.push('/designs');
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{template.name}</h1>
          <p className="text-gray-600 capitalize">{template.channel} Template</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/templates')}>
            Back to Templates
          </Button>
          <Button variant="primary" onClick={handleUseTemplate}>
            Use This Template
          </Button>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Tools & Layers */}
        <div className="col-span-3 space-y-4">
          <CanvasToolbar />
          <LayerList
            layers={canvasState.layers}
            selectedLayerId={canvasState.selectedLayerId}
            onLayerSelect={handleLayerSelect}
          />
        </div>

        {/* Center - Canvas */}
        <div className="col-span-6">
          <Canvas state={canvasState} onLayerSelect={handleLayerSelect} />
        </div>

        {/* Right Sidebar - Properties & AI Helper */}
        <div className="col-span-3 space-y-4">
          <PropertyPanel selectedLayer={selectedLayer} />
          <AICopyHelper />
        </div>
      </div>
    </div>
  );
}

