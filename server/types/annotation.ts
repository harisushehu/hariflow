// Bounding Box annotation
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Polygon annotation (list of points)
export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  points: Point[];
}

// Keypoint annotation
export interface Keypoint {
  x: number;
  y: number;
  name: string;
  visible?: boolean;
}

export interface KeypointSet {
  keypoints: Keypoint[];
}

// Classification annotation
export interface Classification {
  className: string;
  confidence?: number;
}

// Generic annotation data
export type AnnotationData = BoundingBox | Polygon | Keypoint[] | Classification;

export interface AnnotationMetadata {
  annotatorId: number;
  timestamp: number;
  tool: string;
  version: number;
}

export interface AnnotationWithMetadata {
  type: 'bbox' | 'polygon' | 'keypoint' | 'classification';
  label: string;
  data: AnnotationData;
  metadata?: AnnotationMetadata;
}
