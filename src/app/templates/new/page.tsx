'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { TemplateForm } from '@/features/templates/components/TemplateForm';
import { TemplateChannel, TemplateStatus } from '@/features/templates/types';
import { createTemplate } from '@/features/templates/api';

export default function NewTemplatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { name: string; channel: TemplateChannel; status: TemplateStatus }) => {
    try {
      setError(null);

      const template = await createTemplate({
        name: values.name,
        channel: values.channel,
        status: values.status,
      });

      console.log('Template created successfully:', template);

      // Redirect to the template detail page
      router.push(`/templates/${template.id}`);
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err instanceof Error ? err.message : 'Failed to create template');
    }
  };

  const handleCancel = () => {
    router.push('/templates');
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Template</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Template Details</h2>
          </CardHeader>
          <CardBody>
            <TemplateForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel="Create Template"
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

