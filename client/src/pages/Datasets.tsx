import React, { useState } from 'react';
import { useDatasets } from '@/hooks/useDatasets';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface DatasetsPageProps {
  projectId: number;
}

export default function Datasets({ projectId }: DatasetsPageProps) {
  const { datasets, isLoading, createDataset } = useDatasets(projectId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleCreateDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDataset(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create dataset:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Datasets</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Dataset'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleCreateDataset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dataset Name</label>
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

            <Button type="submit" className="w-full">
              Create Dataset
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : datasets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No datasets yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {datasets.map((dataset: any) => (
            <Card key={dataset.id} className="p-6">
              <h3 className="font-bold mb-2">{dataset.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{dataset.description}</p>
              <div className="space-y-2 text-sm mb-4">
                <div>Images: {dataset.imageCount}</div>
                <div>Annotated: {dataset.annotatedCount}</div>
                <div>Status: <span className="font-medium">{dataset.status}</span></div>
              </div>
              <Button className="w-full" variant="outline">
                Open Dataset
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
