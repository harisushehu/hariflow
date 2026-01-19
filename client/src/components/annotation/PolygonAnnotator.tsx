import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Point {
  x: number;
  y: number;
}

interface Polygon {
  points: Point[];
  label: string;
}

interface PolygonAnnotatorProps {
  imageUrl: string;
  onAnnotationComplete: (polygon: Polygon) => void;
  labels: string[];
}

export default function PolygonAnnotator({ imageUrl, onAnnotationComplete, labels }: PolygonAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentLabel, setCurrentLabel] = useState(labels[0] || '');
  const [polygons, setPolygons] = useState<Polygon[]>([]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const newPoints = [...points, point];
    setPoints(newPoints);

    // Redraw canvas
    redrawCanvas(newPoints);
  };

  const redrawCanvas = (currentPoints: Point[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw existing polygons
      polygons.forEach((polygon) => {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        polygon.points.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.stroke();
      });

      // Draw current polygon
      if (currentPoints.length > 0) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        currentPoints.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        // Draw points
        currentPoints.forEach((point) => {
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    };
  };

  const completePolygon = () => {
    if (points.length < 3) {
      alert('Polygon must have at least 3 points');
      return;
    }

    const polygon: Polygon = {
      points,
      label: currentLabel,
    };

    setPolygons([...polygons, polygon]);
    onAnnotationComplete(polygon);
    setPoints([]);
  };

  const undo = () => {
    const newPoints = points.slice(0, -1);
    setPoints(newPoints);
    redrawCanvas(newPoints);
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
        <Button onClick={undo} variant="outline" disabled={points.length === 0}>
          Undo
        </Button>
        <Button onClick={completePolygon} disabled={points.length < 3}>
          Complete Polygon
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border-2 border-gray-300 cursor-crosshair"
        width={800}
        height={600}
      />

      <div className="text-sm text-gray-600">
        {points.length} points, {polygons.length} polygon(s) created
      </div>
    </div>
  );
}
