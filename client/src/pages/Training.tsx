import React, { useState } from 'react';
import { useTraining } from '@/hooks/useTraining';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface TrainingPageProps {
  projectId: number;
}

export default function TrainingPage({ projectId }: TrainingPageProps) {
  const { trainingJobs, isLoading, createTrainingJob, cancelJob } = useTraining(projectId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    datasetId: 0,
    modelType: 'yolov8',
    config: {
      epochs: 100,
      batchSize: 16,
      learningRate: 0.001,
      optimizer: 'adam',
      lossFunction: 'crossentropy',
      augmentation: true,
    },
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrainingJob(formData);
      setFormData({
        name: '',
        datasetId: 0,
        modelType: 'yolov8',
        config: {
          epochs: 100,
          batchSize: 16,
          learningRate: 0.001,
          optimizer: 'adam',
          lossFunction: 'crossentropy',
          augmentation: true,
        },
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create training job:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Jobs</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Training Job'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model Type</label>
              <select
                value={formData.modelType}
                onChange={(e) => setFormData({ ...formData, modelType: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="yolov5">YOLOv5</option>
                <option value="yolov8">YOLOv8</option>
                <option value="resnet">ResNet</option>
                <option value="efficientnet">EfficientNet</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Epochs</label>
                <input
                  type="number"
                  value={formData.config.epochs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, epochs: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Batch Size</label>
                <input
                  type="number"
                  value={formData.config.batchSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, batchSize: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Start Training
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : trainingJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No training jobs yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trainingJobs.map((job: any) => (
            <Card key={job.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{job.name}</h3>
                  <p className="text-sm text-gray-600">{job.modelType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>Epochs: {job.epochs}</div>
                <div>Batch: {job.batchSize}</div>
                <div>LR: {job.learningRate}</div>
                <div>Status: {job.status}</div>
              </div>

              {job.status === 'running' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => cancelJob(job.id)}
                >
                  Cancel Job
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
