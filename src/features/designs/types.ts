// Design-related types aligned with database schema

import type { TemplateChannel } from '../templates/types';
import type { CanvasState } from '../canvas/canvasTypes';

/**
 * Design status types
 */
export type DesignStatus = 'draft' | 'active' | 'archived';

/**
 * Design interface matching the database schema
 * Represents an individual design created from a template or from scratch
 */
export interface Design {
  id: string;
  templateId: string | null; // Reference to parent template (nullable)
  name: string;
  channel: TemplateChannel;
  status: DesignStatus;
  canvas: CanvasState | null;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * Database row format (snake_case) - used when reading from Supabase
 */
export interface DesignRow {
  id: string;
  template_id: string | null;
  name: string;
  channel: TemplateChannel;
  status: DesignStatus;
  canvas: CanvasState | null;
  created_at: string;
  updated_at: string;
}

/**
 * Form data for creating/updating designs
 */
export interface DesignFormData {
  name: string;
  templateId?: string | null;
  channel: TemplateChannel;
  status: DesignStatus;
  canvas?: CanvasState | null;
}

/**
 * Helper function to convert database row to Design object
 */
export function designRowToDesign(row: DesignRow): Design {
  return {
    id: row.id,
    templateId: row.template_id,
    name: row.name,
    channel: row.channel,
    status: row.status,
    canvas: row.canvas,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Helper function to convert Design object to database row format
 */
export function designToDesignRow(design: Partial<Design>): Partial<DesignRow> {
  const row: Partial<DesignRow> = {};

  if (design.id !== undefined) row.id = design.id;
  if (design.templateId !== undefined) row.template_id = design.templateId;
  if (design.name !== undefined) row.name = design.name;
  if (design.channel !== undefined) row.channel = design.channel;
  if (design.status !== undefined) row.status = design.status;
  if (design.canvas !== undefined) row.canvas = design.canvas;
  if (design.createdAt !== undefined) row.created_at = design.createdAt;
  if (design.updatedAt !== undefined) row.updated_at = design.updatedAt;

  return row;
}

