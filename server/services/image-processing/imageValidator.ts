// Image validation utilities
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  metadata?: {
    format: string;
    size: number;
    extension: string;
  };
}

export async function validateImageFile(
  file: Buffer,
  mimeType: string,
  fileName: string
): Promise<ImageValidationResult> {
  // Check file size
  if (file.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  if (!SUPPORTED_FORMATS.includes(mimeType)) {
    return {
      valid: false,
      error: `Unsupported image format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    };
  }

  // Check file extension
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file extension. Supported extensions: ${SUPPORTED_EXTENSIONS.join(', ')}`,
    };
  }

  // Validate image magic numbers (basic format verification)
  const isValidFormat = validateImageMagicNumbers(file, mimeType);
  if (!isValidFormat) {
    return {
      valid: false,
      error: 'Invalid image file format',
    };
  }

  return {
    valid: true,
    metadata: {
      format: mimeType,
      size: file.length,
      extension,
    },
  };
}

function validateImageMagicNumbers(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const magic = buffer.slice(0, 4);

  switch (mimeType) {
    case 'image/jpeg':
      // JPEG: FF D8 FF
      return magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
    case 'image/png':
      // PNG: 89 50 4E 47
      return (
        magic[0] === 0x89 &&
        magic[1] === 0x50 &&
        magic[2] === 0x4e &&
        magic[3] === 0x47
      );
    case 'image/bmp':
      // BMP: 42 4D
      return magic[0] === 0x42 && magic[1] === 0x4d;
    case 'image/webp':
      // WebP: RIFF ... WEBP
      return (
        magic[0] === 0x52 &&
        magic[1] === 0x49 &&
        magic[2] === 0x46 &&
        magic[3] === 0x46
      );
    default:
      return true; // Skip validation for other formats
  }
}

export function extractImageDimensions(
  fileName: string,
  mimeType: string
): { width?: number; height?: number } {
  // This is a placeholder - in production, you'd use a library like sharp or jimp
  // to extract actual dimensions from the image buffer
  return {};
}

export function sanitizeFileName(fileName: string): string {
  // Remove special characters and sanitize the filename
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}
