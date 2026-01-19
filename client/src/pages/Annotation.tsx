import React, { useState } from 'react';
import { useAnnotations } from '@/hooks/useAnnotations';
import { Button } from '@/components/ui/button';
import BboxAnnotator from '@/components/annotation/BboxAnnotator';
import PolygonAnnotator from '@/components/annotation/PolygonAnnotator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnnotationPageProps {
  imageId: number;
  datasetId: number;
  imageUrl: string;
  labels: string[];
}

export default function AnnotationPage({
  imageId,
  datasetId,
  imageUrl,
  labels,
}: AnnotationPageProps) {
  const { annotations, createAnnotation } = useAnnotations(imageId, datasetId);
  const [annotationType, setAnnotationType] = useState('bbox');

  const handleBboxComplete = async (bbox: any) => {
    try {
      await createAnnotation({
        type: 'bbox',
        label: bbox.label,
        data: bbox,
      });
    } catch (error) {
      console.error('Failed to create annotation:', error);
    }
  };

  const handlePolygonComplete = async (polygon: any) => {
    try {
      await createAnnotation({
        type: 'polygon',
        label: polygon.label,
        data: polygon,
      });
    } catch (error) {
      console.error('Failed to create annotation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Annotate Image</h2>

      <Tabs value={annotationType} onValueChange={setAnnotationType}>
        <TabsList>
          <TabsTrigger value="bbox">Bounding Box</TabsTrigger>
          <TabsTrigger value="polygon">Polygon</TabsTrigger>
          <TabsTrigger value="keypoint">Keypoint</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
        </TabsList>

        <TabsContent value="bbox" className="space-y-4">
          <BboxAnnotator
            imageUrl={imageUrl}
            onAnnotationComplete={handleBboxComplete}
            labels={labels}
          />
        </TabsContent>

        <TabsContent value="polygon" className="space-y-4">
          <PolygonAnnotator
            imageUrl={imageUrl}
            onAnnotationComplete={handlePolygonComplete}
            labels={labels}
          />
        </TabsContent>

        <TabsContent value="keypoint">
          <div className="p-4 text-center text-gray-500">
            Keypoint annotation tool coming soon
          </div>
        </TabsContent>

        <TabsContent value="classification">
          <div className="p-4 text-center text-gray-500">
            Classification tool coming soon
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Annotations ({annotations.length})</h3>
        <div className="space-y-2">
          {annotations.map((ann: any) => (
            <div key={ann.id} className="flex justify-between items-center p-2 bg-white rounded border">
              <span>
                {ann.type.toUpperCase()} - {ann.label}
              </span>
              <Button variant="ghost" size="sm">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
