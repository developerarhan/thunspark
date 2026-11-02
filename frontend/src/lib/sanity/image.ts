import createImageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from './client';

const imageBuilder = projectId
  ? createImageUrlBuilder({
      projectId,
      dataset,
    })
  : null;

export function urlForImage(source: any) {
  if (!imageBuilder || !source) return null;
  return imageBuilder.image(source);
}
