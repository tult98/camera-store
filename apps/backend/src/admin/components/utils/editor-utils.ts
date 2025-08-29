export const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
export const DEFAULT_PLACEHOLDER = "Write your product description...";

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > FILE_SIZE_LIMIT) {
    return {
      isValid: false,
      error: `File size must be less than ${FILE_SIZE_LIMIT / (1024 * 1024)}MB`,
    };
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPG, PNG, GIF, WebP, and SVG files are supported",
    };
  }

  return { isValid: true };
};

export const validateImageUrl = (
  url: string
): { isValid: boolean; error?: string } => {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }
};

export const getBackendUrl = (): string => {
  return window.location.port === "9000"
    ? window.location.origin
    : `${window.location.protocol}//${window.location.hostname}:9000`;
};