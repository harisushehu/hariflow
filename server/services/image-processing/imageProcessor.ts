import { storagePut } from '../../storage';
import { validateImageFile, sanitizeFileName } from './imageValidator';

export interface ProcessedImage {
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  format: string;
}

export async function processAndUploadImage(
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  datasetId: number
): Promise<ProcessedImage> {
  // Validate image
  const validation = await validateImageFile(fileBuffer, mimeType, originalFileName);
  if (!validation.valid) {
    throw new Error(validation.error || 'Image validation failed');
  }

  // Sanitize filename
  const sanitizedName = sanitizeFileName(originalFileName);
  
  // Generate unique file key
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
  const fileKey = `datasets/${datasetId}/images/${timestamp}-${random}${fileExtension}`;

  // Upload to S3
  const { url } = await storagePut(fileKey, fileBuffer, mimeType);

  return {
    fileName: sanitizedName,
    fileUrl: url,
    fileKey,
    fileSize: fileBuffer.length,
    format: mimeType,
  };
}

export async function processAndUploadImageBatch(
  files: Array<{ buffer: Buffer; fileName: string; mimeType: string }>,
  datasetId: number
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = [];
  
  for (const file of files) {
    try {
      const processed = await processAndUploadImage(
        file.buffer,
        file.fileName,
        file.mimeType,
        datasetId
      );
      results.push(processed);
    } catch (error) {
      console.error(`Failed to process image ${file.fileName}:`, error);
      // Continue processing other images
    }
  }

  return results;
}

export function getImageFormatFromMimeType(mimeType: string): string {
  const formatMap: { [key: string]: string } = {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/webp': 'webp',
  };
  return formatMap[mimeType] || 'unknown';
}
