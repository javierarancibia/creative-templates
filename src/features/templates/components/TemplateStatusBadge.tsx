import { Badge } from '@/components/ui/Badge';
import { Template } from '../types';

interface TemplateStatusBadgeProps {
  status: Template['status'];
}

export function TemplateStatusBadge({ status }: TemplateStatusBadgeProps) {
  const variantMap = {
    draft: 'default' as const,
    active: 'success' as const,
    archived: 'warning' as const,
  };

  const labelMap = {
    draft: 'Draft',
    active: 'Active',
    archived: 'Archived',
  };

  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}

