'use client';

import { useState } from 'react';
import { TemplateChannel, TemplateStatus } from '../types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface TemplateFormProps {
  initialValues?: {
    name: string;
    channel: TemplateChannel;
    status?: TemplateStatus;
  };
  onSubmit: (values: { name: string; channel: TemplateChannel; status: TemplateStatus }) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TemplateForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save Template' }: TemplateFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [channel, setChannel] = useState<TemplateChannel>(initialValues?.channel || 'instagram');
  const [status, setStatus] = useState<TemplateStatus>(initialValues?.status || 'draft');
  const [errors, setErrors] = useState<{ name?: string; channel?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { name?: string; channel?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!channel) {
      newErrors.channel = 'Channel is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), channel, status });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Template Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) {
            setErrors({ ...errors, name: undefined });
          }
        }}
        placeholder="Enter template name"
        required
        error={errors.name}
      />

      <Select
        label="Channel"
        value={channel}
        onChange={(e) => {
          setChannel(e.target.value as TemplateChannel);
          if (errors.channel) {
            setErrors({ ...errors, channel: undefined });
          }
        }}
        options={[
          { value: 'facebook', label: 'Facebook' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'display', label: 'Display Ads' },
        ]}
        required
        error={errors.channel}
      />

      <Select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as TemplateStatus)}
        options={[
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

