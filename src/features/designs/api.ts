// Front-end data helpers that call API routes
import { Design, DesignFormData } from './types';

export async function getDesigns(): Promise<Design[]> {
  // TODO: Implement API call
  return [];
}

export async function getDesign(_id: string): Promise<Design | null> {
  // TODO: Implement API call
  return null;
}

export async function createDesign(_data: DesignFormData): Promise<Design> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

export async function updateDesign(_id: string, _data: Partial<DesignFormData>): Promise<Design> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

export async function deleteDesign(_id: string): Promise<void> {
  // TODO: Implement API call
  throw new Error('Not implemented');
}

