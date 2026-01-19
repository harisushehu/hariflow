import { createImage, getDatasetById, updateDataset } from '../../db';
import { processAndUploadImage } from '../image-processing/imageProcessor';

export interface UploadResult {
  success: boolean;
  imageId?: number;
  error?: string;
}

export async function uploadImageToDataset(
  datasetId: number,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    const dataset = await getDatasetById(datasetId);
    if (!dataset) {
      return { success: false, error: 'Dataset not found' };
    }

    // Process and upload image
    const processedImage = await processAndUploadImage(fileBuffer, fileName, mimeType, datasetId);

    // Create image record in database
    const result = await createImage({
      datasetId,
      fileName: processedImage.fileName,
      fileUrl: processedImage.fileUrl,
      fileKey: processedImage.fileKey,
      fileSize: processedImage.fileSize,
      format: processedImage.format,
      annotated: false,
    });

    const imageId = (result as any).insertId;

    // Increment image count
    const currentDataset = await getDatasetById(datasetId);
    if (currentDataset) {
      await updateDataset(datasetId, {
        imageCount: currentDataset.imageCount + 1,
      });
    }

    return { success: true, imageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

export async function uploadMultipleImages(
  datasetId: number,
  files: Array<{ buffer: Buffer; fileName: string; mimeType: string }>
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadImageToDataset(datasetId, file.buffer, file.fileName, file.mimeType);
    results.push(result);
  }

  return results;
}

export async function getUploadProgress(datasetId: number): Promise<{
  totalImages: number;
  uploadedImages: number;
  failedImages: number;
  progress: number;
}> {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) {
    throw new Error('Dataset not found');
  }

  return {
    totalImages: dataset.imageCount,
    uploadedImages: dataset.imageCount,
    failedImages: 0,
    progress: 100,
  };
}
