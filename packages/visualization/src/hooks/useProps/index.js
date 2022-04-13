import { useCallback } from 'react';

export default function useProps() {
  const getDamages = useCallback((image, damages) => {
    const views = image.views
      .filter((view) => damages?.find((dmg) => dmg.id === view?.element_id));

    return views.map((view) => {
      if (view?.image_region?.specification?.bounding_box) {
        const { xmin, ymin, height, width } = view.image_region.specification.bounding_box;
        const [rx, ry] = [width / 2, height / 2];

        return ({
          damageType: damages?.find((dmg) => dmg.id === view?.element_id).damageType,
          id: view?.element_id,
          ellipse: view?.created_by === 'algo' ? null : ({
            cx: xmin + rx,
            cy: ymin + ry,
            rx,
            ry,
          }),
          polygons: view?.created_by === 'algo'
            ? (view?.image_region?.specification?.polygons)
            : null,
        });
      }

      return null;
    }).filter((damage) => damage);
  }, []);

  const getPolygons = useCallback((imageId, views) => {
    const dmgViews = views?.filter((view) => view.image_region?.image_id === imageId);
    const specifications = dmgViews?.filter((v) => v.image_region)
      ?.map((v) => v.image_region?.specification)
      ?.map((spec) => spec.polygons);
    return specifications ?? null;
  }, []);

  const getImage = useCallback((oneImage) => {
    const { id, imageHeight: height, imageWidth: width, path } = oneImage;
    return { id, height, width, source: { uri: path } };
  }, []);

  return { getDamages, getImage, getPolygons };
}
