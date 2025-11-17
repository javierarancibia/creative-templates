'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Design } from '@/features/designs/types';
import { fetchDesign, updateDesignCanvas } from '@/features/designs/api';
import { createTemplate } from '@/features/templates/api';
import { CanvasEditor } from '@/features/canvas/components/CanvasEditor';
import { CanvasState, createEmptyCanvas } from '@/features/canvas/canvasTypes';
import { Badge } from '@/components/ui/Badge';

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const designId = params.id as string;

  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingAsTemplate, setSavingAsTemplate] = useState(false);

  useEffect(() => {
    async function loadDesign() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDesign(designId);
        setDesign(data);
      } catch (err) {
        console.error('Error loading design:', err);
        setError(err instanceof Error ? err.message : 'Failed to load design');
      } finally {
        setLoading(false);
      }
    }

    loadDesign();
  }, [designId]);

  const handleSaveCanvas = async (canvas: CanvasState) => {
    try {
      setSaveMessage(null);
      const updatedDesign = await updateDesignCanvas(designId, canvas);
      setDesign(updatedDesign);
      setSaveMessage({ type: 'success', text: 'Design saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Error saving design:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save design';
      setSaveMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!design) return;

    try {
      setSavingAsTemplate(true);
      setSaveMessage(null);

      const template = await createTemplate({
        name: `${design.name} (Template)`,
        channel: design.channel,
        status: 'draft',
        canvas: design.canvas || createEmptyCanvas(),
      });

      setSaveMessage({ type: 'success', text: 'Saved as template successfully!' });
      
      // Navigate to the new template after a short delay
      setTimeout(() => {
        router.push(`/templates/${template.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error saving as template:', err);
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save as template',
      });
    } finally {
      setSavingAsTemplate(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading design...</p>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Design not found'}</p>
          <Button variant="outline" onClick={() => router.push('/designs')} className="mt-4">
            Back to Designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{design.name}</h1>
            <Badge variant={design.status === 'active' ? 'success' : design.status === 'archived' ? 'warning' : 'default'}>
              {design.status}
            </Badge>
          </div>
          <p className="text-gray-600 capitalize">{design.channel} Design</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveAsTemplate}
            disabled={savingAsTemplate}
          >
            {savingAsTemplate ? 'Saving...' : 'Save as Template'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/designs')}>
            Back to Designs
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Canvas Editor */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Canvas Editor</h2>
              {saveMessage && (
                <div
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    saveMessage.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {saveMessage.text}
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="h-[800px]">
              <CanvasEditor
                initialCanvas={design.canvas || createEmptyCanvas()}
                onSave={handleSaveCanvas}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

