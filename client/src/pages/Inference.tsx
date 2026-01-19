import React, { useState } from 'react';
import { useInference } from '@/hooks/useInference';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface InferencePageProps {
  modelId: number;
}

export default function InferencePage({ modelId }: InferencePageProps) {
  const { predict, isPredicting, predictions } = useInference(modelId);
  const [imageUrl, setImageUrl] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [lastPrediction, setLastPrediction] = useState<any>(null);

  const handlePredict = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    try {
      const result = await predict({
        imageUrl,
        confidenceThreshold,
      });
      setLastPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Model Inference</h2>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confidence Threshold: {confidenceThreshold.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <Button
            onClick={handlePredict}
            disabled={isPredicting}
            className="w-full"
          >
            {isPredicting ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Running Inference...
              </>
            ) : (
              'Run Inference'
            )}
          </Button>
        </div>
      </Card>

      {lastPrediction && (
        <Card className="p-6">
          <h3 className="font-bold mb-4">Prediction Results</h3>
          <div className="space-y-2">
            <div>Processing Time: {lastPrediction.processingTime}ms</div>
            <div>Detections: {lastPrediction.results.length}</div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Detected Objects:</h4>
              <div className="space-y-2">
                {lastPrediction.results.map((result: any, idx: number) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded">
                    <div className="font-medium">{result.class}</div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-bold mb-4">Recent Predictions</h3>
        <div className="space-y-2">
          {predictions.slice(0, 5).map((pred: any) => (
            <div key={pred.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{pred.results?.length || 0} detections</div>
                <div className="text-sm text-gray-600">
                  {new Date(pred.createdAt).toLocaleString()}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
