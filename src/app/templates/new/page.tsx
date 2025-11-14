'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { TemplateForm } from '@/features/templates/components/TemplateForm';
import { TemplateFormData } from '@/features/templates/types';

export default function NewTemplatePage() {
  const router = useRouter();

  const handleSubmit = async (data: TemplateFormData) => {
    // TODO: Implement API call to create template
    console.log('Creating template:', data);
    
    // For now, just redirect back to templates list
    // In the future, redirect to the template detail page
    router.push('/templates');
  };

  const handleCancel = () => {
    router.push('/templates');
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Template</h1>
        
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Template Details</h2>
          </CardHeader>
          <CardBody>
            <TemplateForm onSubmit={handleSubmit} onCancel={handleCancel} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

