import { useCallback } from 'react';

export default function usePolygons() {
  const polygons = useCallback((imageId, views) => {
    const dmgViews = views?.filter((view) => view.image_region?.image_id === imageId);
    const specifications = dmgViews?.filter((v) => v.image_region)
      ?.map((v) => v.image_region?.specification)
      ?.map((spec) => spec.polygons);
    return specifications ?? null;
  }, []);

  const image = useCallback((oneImage) => {
    const { id, imageHeight: height, imageWidth: width, path } = oneImage;
    return { id, height, width, source: { uri: path } };
  }, []);

  return [image, polygons];
}
