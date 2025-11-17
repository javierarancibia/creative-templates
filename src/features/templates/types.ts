// Template-related types aligned with database schema

import type { CanvasState } from '../canvas/canvasTypes';

/**
 * Social media channel types supported by templates
 */
export type TemplateChannel = 'facebook' | 'instagram' | 'linkedin' | 'display';

/**
 * Template status types
 */
export type TemplateStatus = 'draft' | 'active' | 'archived';

/**
 * Template interface matching the database schema
 * Represents a reusable template for creating designs
 */
export interface Template {
  id: string;
  name: string;
  channel: TemplateChannel;
  status: TemplateStatus;
  canvas: CanvasState | null;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Database row format (snake_case) - used when reading from Supabase
 */
export interface TemplateRow {
  id: string;
  name: string;
  channel: TemplateChannel;
  status: TemplateStatus;
  canvas: CanvasState | null;
  created_at: string;
  updated_at: string;
}

/**
 * Form data for creating/updating templates
 */
export interface TemplateFormData {
  name: string;
  channel: TemplateChannel;
  status: TemplateStatus;
  canvas?: CanvasState | null;
}

/**
 * Helper function to convert database row to Template object
 */
export function templateRowToTemplate(row: TemplateRow): Template {
  return {
    id: row.id,
    name: row.name,
    channel: row.channel,
    status: row.status,
    canvas: row.canvas,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Helper function to convert Template object to database row format
 */
export function templateToTemplateRow(template: Partial<Template>): Partial<TemplateRow> {
  const row: Partial<TemplateRow> = {};

  if (template.id !== undefined) row.id = template.id;
  if (template.name !== undefined) row.name = template.name;
  if (template.channel !== undefined) row.channel = template.channel;
  if (template.status !== undefined) row.status = template.status;
  if (template.canvas !== undefined) row.canvas = template.canvas;
  if (template.createdAt !== undefined) row.created_at = template.createdAt;
  if (template.updatedAt !== undefined) row.updated_at = template.updatedAt;

  return row;
}

