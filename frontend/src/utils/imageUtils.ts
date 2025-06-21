/**
 * Utility function to handle image URLs properly
 * @param image - The image URL from backend
 * @param fallback - Fallback image if no image is provided
 * @returns Properly formatted image URL
 */
export function formatImageUrl(image: string | null | undefined, fallback: string = '/shopit.svg'): string {
  if (!image) {
    return fallback;
  }
  
  // If image already starts with http, return as is
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // If image starts with /, return as is (already properly formatted)
  if (image.startsWith('/')) {
    return image;
  }
  
  // Otherwise, add / prefix
  return `/${image}`;
}
