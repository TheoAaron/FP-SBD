
export function formatImageUrl(image: string | null | undefined, fallback: string = '/shopit.svg'): string {
  if (!image) {
    return fallback;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/')) {
    return image;
  }

  return `/${image}`;
}
