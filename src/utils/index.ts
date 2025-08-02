/**
 * Creates a URL for an image, either from a File object or a string URL.
 * @param fileOrUrl The File object or string URL.
 * @returns A string URL or undefined.
 */
export const getFileUrl = (fileOrUrl: File | string | undefined): string | undefined => {
  if (fileOrUrl instanceof File) {
    return URL.createObjectURL(fileOrUrl);
  }
  if (typeof fileOrUrl === 'string') {
    return fileOrUrl;
  }
  return undefined;
};