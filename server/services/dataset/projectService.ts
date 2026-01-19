import {
  createProject,
  getProjectById,
  updateProject,
  getUserProjects,
  getProjectDatasets,
  getProjectLabels,
  getProjectTrainingJobs,
  getProjectModels,
} from '../../db';
import { Project } from '../../../drizzle/schema';

export interface CreateProjectInput {
  userId: number;
  name: string;
  description?: string;
  type: 'detection' | 'classification' | 'segmentation' | 'keypoint';
}

export interface ProjectSummary {
  project: Project;
  datasetCount: number;
  labelCount: number;
  trainingJobCount: number;
  modelCount: number;
}

export async function createNewProject(input: CreateProjectInput): Promise<Project> {
  const result = await createProject({
    userId: input.userId,
    name: input.name,
    description: input.description,
    type: input.type,
    status: 'active',
  });

  const projectId = (result as any).insertId;
  const project = await getProjectById(projectId);
  if (!project) throw new Error('Failed to create project');
  return project;
}

export async function getUserProjectsList(userId: number): Promise<ProjectSummary[]> {
  const projects = await getUserProjects(userId);

  const summaries = await Promise.all(
    projects.map(async (project) => {
      const datasets = await getProjectDatasets(project.id);
      const labels = await getProjectLabels(project.id);
      const trainingJobs = await getProjectTrainingJobs(project.id);
      const models = await getProjectModels(project.id);

      return {
        project,
        datasetCount: datasets.length,
        labelCount: labels.length,
        trainingJobCount: trainingJobs.length,
        modelCount: models.length,
      };
    })
  );

  return summaries;
}

export async function getProjectSummary(projectId: number): Promise<ProjectSummary> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error('Project not found');

  const datasets = await getProjectDatasets(projectId);
  const labels = await getProjectLabels(projectId);
  const trainingJobs = await getProjectTrainingJobs(projectId);
  const models = await getProjectModels(projectId);

  return {
    project,
    datasetCount: datasets.length,
    labelCount: labels.length,
    trainingJobCount: trainingJobs.length,
    modelCount: models.length,
  };
}

export async function updateProjectData(
  projectId: number,
  updates: Partial<CreateProjectInput>
): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) throw new Error('Project not found');

  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.type) updateData.type = updates.type;

  await updateProject(projectId, updateData);
}

export async function archiveProject(projectId: number): Promise<void> {
  await updateProject(projectId, { status: 'archived' });
}

export async function activateProject(projectId: number): Promise<void> {
  await updateProject(projectId, { status: 'active' });
}

export async function validateProjectName(name: string): Promise<{ valid: boolean; error?: string }> {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name cannot be empty' };
  }
  if (name.length > 255) {
    return { valid: false, error: 'Project name cannot exceed 255 characters' };
  }
  return { valid: true };
}

export async function validateProjectType(type: string): Promise<{ valid: boolean; error?: string }> {
  const validTypes = ['detection', 'classification', 'segmentation', 'keypoint'];
  if (!validTypes.includes(type)) {
    return {
      valid: false,
      error: `Invalid project type. Supported types: ${validTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

export function getProjectTypeDescription(type: string): string {
  const descriptions: { [key: string]: string } = {
    detection: 'Object Detection - Identify and locate objects in images',
    classification: 'Image Classification - Categorize entire images',
    segmentation: 'Semantic Segmentation - Pixel-level classification',
    keypoint: 'Keypoint Detection - Locate specific points of interest',
  };
  return descriptions[type] || 'Unknown project type';
}
