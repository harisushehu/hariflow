import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const { projects, isLoading, createProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'detection',
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(formData);
      setFormData({ name: '', description: '', type: 'detection' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view projects</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Project'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Project Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="detection">Object Detection</option>
                <option value="classification">Image Classification</option>
                <option value="segmentation">Segmentation</option>
                <option value="keypoint">Keypoint Detection</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Create Project
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <Card key={project.project.id} className="p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2">{project.project.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{project.project.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>Datasets: {project.datasetCount}</div>
                <div>Models: {project.modelCount}</div>
                <div>Labels: {project.labelCount}</div>
                <div>Training: {project.trainingJobCount}</div>
              </div>
              <Button className="w-full" variant="outline">
                Open Project
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
