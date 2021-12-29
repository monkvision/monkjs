import { useCallback } from 'react';

export default function usePolygon() {
  const extractPolygons = useCallback((imageId, views) => {
    const dmgViews = views?.filter((view) => view.image_region?.image_id === imageId);
    const specifications = dmgViews?.filter((v) => v.image_region)
      ?.map((v) => v.image_region?.specification)
      ?.map((spec) => spec.polygons);
    return specifications ?? null;
  }, []);

  const formatImage = useCallback((image) => {
    const { id, imageHeight: height, imageWidth: width, path } = image;
    return { id, height, width, source: { uri: path } };
  }, []);

  return [formatImage, extractPolygons];
}
