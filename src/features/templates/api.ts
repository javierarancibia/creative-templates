// Front-end data helpers that call API routes
import { Template, TemplateFormData } from './types';

export async function getTemplates(): Promise<Template[]> {
  // TODO: Implement API call
  return [];
}

export async function getTemplate(_id: string): Promise<Template | null> {
  // TODO: Implement API call
  return null;
}

export async function createTemplate(_data: TemplateFormData): Promise<Template> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

export async function updateTemplate(_id: string, _data: Partial<TemplateFormData>): Promise<Template> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

export async function deleteTemplate(_id: string): Promise<void> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

