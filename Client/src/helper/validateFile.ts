// Allowed file types and extensions
const ALLOWED_TYPES = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    extensions: ['mp4', 'webm', 'mov']
  },
  file: {
    mimeTypes: ['application/pdf', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['pdf', 'doc', 'docx', 'txt']
  }
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
  fileType?: 'image' | 'video' | 'file';
}

/* Validate file before upload,  Checks: MIME type, extension, file size */
export const validateFile = (file?: File): ValidationResult => {
  // 1. Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // 2. Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 50MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    };
  }

  // 3. Get file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop() || '';

  // 4. Get MIME type
  const mimeType = file.type.toLowerCase();

  // 5. Check if it's image
  if (
    ALLOWED_TYPES.image.mimeTypes.includes(mimeType) ||
    ALLOWED_TYPES.image.extensions.includes(fileExtension)
  ) {
    return { valid: true, fileType: 'image' };
  }

  // 6. Check if it's video
  if (
    ALLOWED_TYPES.video.mimeTypes.includes(mimeType) ||
    ALLOWED_TYPES.video.extensions.includes(fileExtension)
  ) {
    return { valid: true, fileType: 'video' };
  }

  // 7. Check if it's document/file
  if (
    ALLOWED_TYPES.file.mimeTypes.includes(mimeType) ||
    ALLOWED_TYPES.file.extensions.includes(fileExtension)
  ) {
    return { valid: true, fileType: 'file' };
  }

  // 8. If no match, return error
  return {
    valid: false,
    error: `File type not allowed. Supported: Images (jpg, png, gif), Videos (mp4, webm), Documents (pdf, doc, docx, txt)`
  };
};

/* Get file type category */
export const getFileTypeCategory = (fileName: string): 'image' | 'video' | 'file' | 'unknown' => {
  const extension = fileName.toLowerCase().split('.').pop() || '';

  if (ALLOWED_TYPES.image.extensions.includes(extension)) return 'image';
  if (ALLOWED_TYPES.video.extensions.includes(extension)) return 'video';
  if (ALLOWED_TYPES.file.extensions.includes(extension)) return 'file';

  return 'unknown';
};
