// Template-related types
export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  canvasData?: Record<string, unknown>; // Will be defined more specifically later
}

export interface TemplateFormData {
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
}

