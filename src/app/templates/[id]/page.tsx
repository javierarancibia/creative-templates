'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { TemplateForm } from '@/features/templates/components/TemplateForm';
import { TemplateStatusBadge } from '@/features/templates/components/TemplateStatusBadge';
import { Template, TemplateChannel, TemplateStatus } from '@/features/templates/types';
import { fetchTemplate, updateTemplate, updateTemplateCanvas } from '@/features/templates/api';
import { CanvasEditor } from '@/features/canvas/components/CanvasEditor';
import { CanvasState, createEmptyCanvas } from '@/features/canvas/canvasTypes';

function AICopyHelperPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">AI Copy Helper</h2>
      </CardHeader>
      <CardBody>
        <div className="p-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">AI copy helper will be implemented here</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplate() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTemplate(templateId);
        setTemplate(data);
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, [templateId]);

  const handleUpdateTemplate = async (values: { name: string; channel: TemplateChannel; status: TemplateStatus }) => {
    try {
      setUpdateError(null);

      const updatedTemplate = await updateTemplate(templateId, {
        name: values.name,
        channel: values.channel,
        status: values.status,
      });

      setTemplate(updatedTemplate);
      console.log('Template updated successfully:', updatedTemplate);
    } catch (err) {
      console.error('Error updating template:', err);
      setUpdateError(err instanceof Error ? err.message : 'Failed to update template');
      throw err; // Re-throw to let the form handle it
    }
  };

  const handleSaveCanvas = async (canvas: CanvasState) => {
    try {
      const updatedTemplate = await updateTemplate(templateId, {
        canvas,
      });
      setTemplate(updatedTemplate);
      console.log('Canvas saved successfully');
    } catch (err) {
      console.error('Error saving canvas:', err);
      setUpdateError(err instanceof Error ? err.message : 'Failed to save canvas');
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Template not found'}</p>
          <Button variant="outline" onClick={() => router.push('/templates')} className="mt-4">
            Back to Templates
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
            <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
            <TemplateStatusBadge status={template.status} />
          </div>
          <p className="text-gray-600 capitalize">{template.channel} Template</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/templates')}>
            Back to Templates
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Metadata Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Template Details</h2>
          </CardHeader>
          <CardBody>
            {updateError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{updateError}</p>
              </div>
            )}
            <TemplateForm
              initialValues={{
                name: template.name,
                channel: template.channel,
                status: template.status,
              }}
              onSubmit={handleUpdateTemplate}
              submitLabel="Update Template"
            />
          </CardBody>
        </Card>

        {/* Canvas Editor */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Canvas Editor</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="h-[800px]">
              <CanvasEditor
                initialCanvas={template.canvas || createEmptyCanvas()}
                onSave={handleSaveCanvas}
              />
            </div>
          </CardBody>
        </Card>

        {/* AI Copy Helper Placeholder */}
        <AICopyHelperPlaceholder />
      </div>
    </div>
  );
}

