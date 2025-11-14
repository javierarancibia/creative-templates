// Design-related types
export interface Design {
  id: string;
  name: string;
  templateId?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  canvasData?: Record<string, unknown>; // Will be defined more specifically later
}

export interface DesignFormData {
  name: string;
  templateId?: string;
}

