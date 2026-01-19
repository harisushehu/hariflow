import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface BboxAnnotatorProps {
  imageUrl: string;
  onAnnotationComplete: (bbox: BoundingBox) => void;
  labels: string[];
}

export default function BboxAnnotator({ imageUrl, onAnnotationComplete, labels }: BboxAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentLabel, setCurrentLabel] = useState(labels[0] || '');
  const [bboxes, setBboxes] = useState<BoundingBox[]>([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Redraw canvas
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw existing bboxes
      bboxes.forEach((bbox) => {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
      });

      // Draw current bbox
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const width = endPos.x - startPos.x;
    const height = endPos.y - startPos.y;

    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      const newBbox: BoundingBox = {
        x: Math.min(startPos.x, endPos.x),
        y: Math.min(startPos.y, endPos.y),
        width: Math.abs(width),
        height: Math.abs(height),
        label: currentLabel,
      };

      setBboxes([...bboxes, newBbox]);
      onAnnotationComplete(newBbox);
    }

    setIsDrawing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDrawing(false)}
        className="border-2 border-gray-300 cursor-crosshair"
        width={800}
        height={600}
      />

      <div className="text-sm text-gray-600">
        {bboxes.length} bounding box(es) created
      </div>
    </div>
  );
}
