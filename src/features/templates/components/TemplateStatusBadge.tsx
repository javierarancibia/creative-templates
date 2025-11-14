import { Badge } from '@/components/ui/Badge';
import { Template } from '../types';

interface TemplateStatusBadgeProps {
  status: Template['status'];
}

export function TemplateStatusBadge({ status }: TemplateStatusBadgeProps) {
  const variantMap = {
    draft: 'default' as const,
    published: 'success' as const,
    archived: 'warning' as const,
  };

  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

