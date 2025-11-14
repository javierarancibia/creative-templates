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
      description: '',
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter template description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          required
        />
      </div>

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as TemplateFormData['status'] })}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
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

