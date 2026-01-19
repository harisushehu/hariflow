import { getDatasetAnnotations, getDatasetImages, getImageAnnotations, createExportLog, updateExportLog } from '../../db';
import { storagePut } from '../../storage';

export type ExportFormat = 'coco' | 'yolo' | 'voc' | 'csv' | 'json';

export interface ExportOptions {
  datasetId: number;
  format: ExportFormat;
  userId: number;
  includeImages?: boolean;
}

export async function exportDataset(options: ExportOptions): Promise<{ exportId: number; url: string }> {
  // Create export log entry
  const exportLogResult = await createExportLog({
    datasetId: options.datasetId,
    userId: options.userId,
    format: options.format,
    status: 'processing',
  });

  const exportId = (exportLogResult as any).insertId;

  try {
    // Get all data
    const images = await getDatasetImages(options.datasetId);
    const annotations = await getDatasetAnnotations(options.datasetId);

    let exportData: string;
    let fileName: string;

    switch (options.format) {
      case 'coco':
        exportData = await generateCOCOFormat(images, annotations);
        fileName = `dataset_coco_${Date.now()}.json`;
        break;

      case 'yolo':
        exportData = await generateYOLOFormat(images, annotations);
        fileName = `dataset_yolo_${Date.now()}.zip`;
        break;

      case 'voc':
        exportData = await generateVOCFormat(images, annotations);
        fileName = `dataset_voc_${Date.now()}.zip`;
        break;

      case 'csv':
        exportData = await generateCSVFormat(images, annotations);
        fileName = `dataset_${Date.now()}.csv`;
        break;

      case 'json':
        exportData = await generateJSONFormat(images, annotations);
        fileName = `dataset_${Date.now()}.json`;
        break;

      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }

    // Upload to S3
    const fileKey = `exports/${options.datasetId}/${fileName}`;
    const { url } = await storagePut(fileKey, Buffer.from(exportData), 'application/octet-stream');

    // Update export log
    await updateExportLog(exportId, {
      exportUrl: url,
      exportKey: fileKey,
      status: 'completed',
      completedAt: new Date(),
    });

    return { exportId, url };
  } catch (error) {
    // Update export log with error
    await updateExportLog(exportId, {
      status: 'failed',
    });
    throw error;
  }
}

async function generateCOCOFormat(images: any[], annotations: any[]): Promise<string> {
  const cocoData = {
    info: {
      description: 'Exported dataset in COCO format',
      version: '1.0',
      year: new Date().getFullYear(),
      date_created: new Date().toISOString(),
    },
    licenses: [],
    images: images.map((img, idx) => ({
      id: img.id,
      file_name: img.fileName,
      height: img.height || 0,
      width: img.width || 0,
    })),
    annotations: annotations.map((ann, idx) => ({
      id: ann.id,
      image_id: ann.imageId,
      category_id: ann.label,
      area: calculateArea(ann.data),
      bbox: extractBbox(ann.data),
      iscrowd: 0,
    })),
    categories: Array.from(new Set(annotations.map((a) => a.label))).map((label, idx) => ({
      id: idx + 1,
      name: label,
      supercategory: 'object',
    })),
  };

  return JSON.stringify(cocoData, null, 2);
}

async function generateYOLOFormat(images: any[], annotations: any[]): Promise<string> {
  // YOLO format: one txt file per image with normalized coordinates
  let yoloData = '';

  for (const image of images) {
    const imageAnnotations = annotations.filter((a) => a.imageId === image.id);
    const lines = imageAnnotations.map((ann) => {
      const bbox = extractBbox(ann.data);
      if (!bbox) return '';

      const centerX = (bbox[0] + bbox[2] / 2) / (image.width || 1);
      const centerY = (bbox[1] + bbox[3] / 2) / (image.height || 1);
      const width = bbox[2] / (image.width || 1);
      const height = bbox[3] / (image.height || 1);

      return `${ann.label} ${centerX} ${centerY} ${width} ${height}`;
    });

    yoloData += `${image.fileName}\n${lines.join('\n')}\n`;
  }

  return yoloData;
}

async function generateVOCFormat(images: any[], annotations: any[]): Promise<string> {
  // Pascal VOC format: XML files
  let vocData = '';

  for (const image of images) {
    const imageAnnotations = annotations.filter((a) => a.imageId === image.id);

    let xml = `<?xml version="1.0"?>\n<annotation>\n`;
    xml += `  <filename>${image.fileName}</filename>\n`;
    xml += `  <size>\n`;
    xml += `    <width>${image.width || 0}</width>\n`;
    xml += `    <height>${image.height || 0}</height>\n`;
    xml += `  </size>\n`;

    for (const ann of imageAnnotations) {
      const bbox = extractBbox(ann.data);
      if (bbox) {
        xml += `  <object>\n`;
        xml += `    <name>${ann.label}</name>\n`;
        xml += `    <bndbox>\n`;
        xml += `      <xmin>${Math.round(bbox[0])}</xmin>\n`;
        xml += `      <ymin>${Math.round(bbox[1])}</ymin>\n`;
        xml += `      <xmax>${Math.round(bbox[0] + bbox[2])}</xmax>\n`;
        xml += `      <ymax>${Math.round(bbox[1] + bbox[3])}</ymax>\n`;
        xml += `    </bndbox>\n`;
        xml += `  </object>\n`;
      }
    }

    xml += `</annotation>\n`;
    vocData += xml;
  }

  return vocData;
}

async function generateCSVFormat(images: any[], annotations: any[]): Promise<string> {
  let csv = 'image_id,image_name,annotation_type,label,data\n';

  for (const ann of annotations) {
    const image = images.find((i) => i.id === ann.imageId);
    if (image) {
      csv += `${ann.imageId},"${image.fileName}","${ann.type}","${ann.label}","${JSON.stringify(ann.data).replace(/"/g, '""')}"\n`;
    }
  }

  return csv;
}

async function generateJSONFormat(images: any[], annotations: any[]): Promise<string> {
  const data = {
    images,
    annotations,
    metadata: {
      exportDate: new Date().toISOString(),
      totalImages: images.length,
      totalAnnotations: annotations.length,
    },
  };

  return JSON.stringify(data, null, 2);
}

function extractBbox(data: any): [number, number, number, number] | null {
  if (data.x !== undefined && data.y !== undefined && data.width !== undefined && data.height !== undefined) {
    return [data.x, data.y, data.width, data.height];
  }
  return null;
}

function calculateArea(data: any): number {
  const bbox = extractBbox(data);
  if (bbox) {
    return bbox[2] * bbox[3];
  }
  return 0;
}

export async function validateExportFormat(format: string): Promise<{ valid: boolean; error?: string }> {
  const validFormats: ExportFormat[] = ['coco', 'yolo', 'voc', 'csv', 'json'];
  if (!validFormats.includes(format as ExportFormat)) {
    return {
      valid: false,
      error: `Invalid export format. Supported formats: ${validFormats.join(', ')}`,
    };
  }
  return { valid: true };
}
