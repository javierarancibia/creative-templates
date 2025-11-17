// Front-end data helpers that call API routes
import { Design, DesignStatus } from './types';
import { TemplateChannel } from '../templates/types';
import type { CanvasState } from '../canvas/canvasTypes';

/**
 * Fetches all designs from the API
 * @returns Promise<Design[]> - List of designs ordered by updated_at desc
 * @throws Error if the request fails
 */
export async function fetchDesigns(): Promise<Design[]> {
  const response = await fetch('/api/designs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch designs' }));
    throw new Error(error.error || `Failed to fetch designs: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches a single design by ID
 * @param id - Design ID
 * @returns Promise<Design> - The design object
 * @throws Error if the request fails or design not found
 */
export async function fetchDesign(id: string): Promise<Design> {
  const response = await fetch(`/api/designs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch design' }));
    throw new Error(error.error || `Failed to fetch design: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Creates a new design
 * @param payload - Design creation data
 * @returns Promise<Design> - The created design
 * @throws Error if the request fails or validation fails
 */
export async function createDesign(payload: {
  name: string;
  channel: TemplateChannel;
  templateId?: string | null;
  status?: DesignStatus;
  canvas?: unknown;
}): Promise<Design> {
  const response = await fetch('/api/designs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create design' }));
    throw new Error(error.error || `Failed to create design: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Updates an existing design
 * @param id - Design ID
 * @param payload - Partial design data to update
 * @returns Promise<Design> - The updated design
 * @throws Error if the request fails or design not found
 */
export async function updateDesign(
  id: string,
  payload: Partial<{
    name: string;
    channel: TemplateChannel;
    status: DesignStatus;
    templateId: string | null;
    canvas: unknown;
  }>
): Promise<Design> {
  const response = await fetch(`/api/designs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update design' }));
    throw new Error(error.error || `Failed to update design: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Updates only the canvas state of a design
 * @param id - Design ID
 * @param canvas - Canvas state to save
 * @returns Promise<Design> - The updated design
 * @throws Error if the request fails or design not found
 */
export async function updateDesignCanvas(
  id: string,
  canvas: CanvasState
): Promise<Design> {
  return updateDesign(id, { canvas });
}

/**
 * Deletes a design
 * @param id - Design ID
 * @throws Error if the request fails
 */
export async function deleteDesign(id: string): Promise<void> {
  const response = await fetch(`/api/designs/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete design' }));
    throw new Error(error.error || `Failed to delete design: ${response.statusText}`);
  }
}

// Legacy function names for backward compatibility
export const getDesigns = fetchDesigns;
export const getDesign = fetchDesign;

