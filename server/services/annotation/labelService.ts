import {
  createLabel,
  getProjectLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
} from '../../db';
import { Label } from '../../../drizzle/schema';

export interface CreateLabelInput {
  projectId: number;
  name: string;
  color?: string;
  description?: string;
}

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
];

export async function createNewLabel(input: CreateLabelInput): Promise<Label> {
  const color = input.color || DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

  const result = await createLabel({
    projectId: input.projectId,
    name: input.name,
    color,
    description: input.description,
  });

  const labelId = (result as any).insertId;
  const label = await getLabelById(labelId);
  if (!label) throw new Error('Failed to create label');
  return label;
}

export async function getProjectLabelsList(projectId: number): Promise<Label[]> {
  return getProjectLabels(projectId);
}

export async function updateLabelData(
  labelId: number,
  updates: Partial<CreateLabelInput>
): Promise<void> {
  const label = await getLabelById(labelId);
  if (!label) throw new Error('Label not found');

  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.color) updateData.color = updates.color;
  if (updates.description !== undefined) updateData.description = updates.description;

  await updateLabel(labelId, updateData);
}

export async function deleteLabelById(labelId: number): Promise<void> {
  await deleteLabel(labelId);
}

export async function validateLabelName(name: string): Promise<{ valid: boolean; error?: string }> {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Label name cannot be empty' };
  }
  if (name.length > 255) {
    return { valid: false, error: 'Label name cannot exceed 255 characters' };
  }
  return { valid: true };
}

export async function validateLabelColor(color: string): Promise<{ valid: boolean; error?: string }> {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexColorRegex.test(color)) {
    return { valid: false, error: 'Invalid color format. Use hex color (e.g., #FF6B6B)' };
  }
  return { valid: true };
}

export function generateDefaultLabels(projectId: number): CreateLabelInput[] {
  const defaultLabels = [
    { name: 'Person', description: 'Human individuals' },
    { name: 'Vehicle', description: 'Cars, trucks, motorcycles' },
    { name: 'Animal', description: 'Dogs, cats, birds, etc.' },
    { name: 'Object', description: 'General objects' },
    { name: 'Background', description: 'Background elements' },
  ];

  return defaultLabels.map((label, index) => ({
    projectId,
    name: label.name,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    description: label.description,
  }));
}
