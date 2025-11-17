// Front-end data helpers that call API routes
import { Template, TemplateChannel, TemplateStatus } from './types';

/**
 * Fetches all templates from the API
 * @returns Promise<Template[]> - List of templates ordered by updated_at desc
 * @throws Error if the request fails
 */
export async function fetchTemplates(): Promise<Template[]> {
  const response = await fetch('/api/templates', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch templates' }));
    throw new Error(error.error || `Failed to fetch templates: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches a single template by ID
 * @param id - Template ID
 * @returns Promise<Template> - The template object
 * @throws Error if the request fails or template not found
 */
export async function fetchTemplate(id: string): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch template' }));
    throw new Error(error.error || `Failed to fetch template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Creates a new template
 * @param payload - Template creation data
 * @returns Promise<Template> - The created template
 * @throws Error if the request fails or validation fails
 */
export async function createTemplate(payload: {
  name: string;
  channel: TemplateChannel;
  status?: TemplateStatus;
  canvas?: unknown;
}): Promise<Template> {
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create template' }));
    throw new Error(error.error || `Failed to create template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Updates an existing template
 * @param id - Template ID
 * @param payload - Partial template data to update
 * @returns Promise<Template> - The updated template
 * @throws Error if the request fails or template not found
 */
export async function updateTemplate(
  id: string,
  payload: Partial<{
    name: string;
    channel: TemplateChannel;
    status: TemplateStatus;
    canvas: unknown;
  }>
): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update template' }));
    throw new Error(error.error || `Failed to update template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Deletes a template
 * @param id - Template ID
 * @throws Error if the request fails
 */
export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete template' }));
    throw new Error(error.error || `Failed to delete template: ${response.statusText}`);
  }
}

// Legacy function names for backward compatibility
export const getTemplates = fetchTemplates;
export const getTemplate = fetchTemplate;

