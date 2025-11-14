'use client';

import { useState } from 'react';
import { TemplateFormData } from '../types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface TemplateFormProps {
  initialData?: TemplateFormData;
  onSubmit: (data: TemplateFormData) => void;
  onCancel?: () => void;
}

export function TemplateForm({ initialData, onSubmit, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState<TemplateFormData>(
    initialData || {
      name: '',
      channel: 'instagram',
      status: 'draft',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Template Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter template name"
        required
      />

      <Select
        label="Channel"
        value={formData.channel}
        onChange={(e) => setFormData({ ...formData, channel: e.target.value as TemplateFormData['channel'] })}
        options={[
          { value: 'facebook', label: 'Facebook' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'display', label: 'Display Ads' },
        ]}
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as TemplateFormData['status'] })}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary">
          Save Template
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

