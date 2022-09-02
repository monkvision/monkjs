import React, { useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';

import ElementHighlight from '../ElementHighlight';

const DamageHighlight = forwardRef(({
  image,
  damages,
  damageStyle,
  options,
  onPressDamage,
  ...passThroughProps
}, ref) => {
  /**
   * Filter all views from vehicle parts, showing only damages
   */
  const imageViewDamage = useMemo(() => image.views
    ?.filter((view) => damages.some(({ id }) => view.elementId === id)), [image, damages]);

  const userDamagesViews = useMemo(() => imageViewDamage?.filter((view) => view.createdBy !== 'algo'), [imageViewDamage]);
  const aiDamagesViews = useMemo(() => imageViewDamage?.filter((view) => view.createdBy === 'algo'), [imageViewDamage]);

  const elementImage = useMemo(() => ({
    height: image.imageHeight,
    width: image.imageWidth,
    source: { uri: image.path },
    id: image.id,
  }), [image]);

  const damageElements = useMemo(() => {
    if (!userDamagesViews || !aiDamagesViews) { return null; }

    const aiDamages = aiDamagesViews.map((view) => {
      const damage = damages.find(({ id }) => id === view.elementId);

      return {
        elementStyle: damageStyle(damage),
        elementType: damage?.damageType,
        id: view.id,
        polygons: view.imageRegion.specification.polygons,
      };
    });
    const userDamages = userDamagesViews.map((view) => {
      const { xmin, ymin, width, height } = view.imageRegion.specification.boundingBox;
      const rx = width * 0.5;
      const ry = height * 0.5;
      const damage = damages.find(({ id }) => id === view.elementId);

      return {
        elementStyle: damageStyle(damage),
        elementType: damages.find(({ id }) => id === view.elementId)?.damageType,
        id: view.id,
        ellipses: ({ cx: xmin + rx, cy: ymin + ry, rx, ry }),
      };
    });

    return [...aiDamages, ...userDamages];
  }, [userDamagesViews, aiDamagesViews]);

  if (!damageElements) { return null; }

  return (
    <ElementHighlight
      image={elementImage}
      elements={damageElements}
      onPressElement={onPressDamage}
      options={options}
      ref={ref}
      {...passThroughProps}
    />
  );
});

DamageHighlight.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.shape({
    createdBy: PropTypes.string,
    damageType: PropTypes.string,
    deletedAt: PropTypes.string,
    id: PropTypes.string,
    inspectionId: PropTypes.string,
  })),
  damageStyle: PropTypes.func,
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageHeight: PropTypes.number.isRequired,
    imageWidth: PropTypes.number.isRequired,
    mimeType: PropTypes.string,
    path: PropTypes.string,
    views: PropTypes.arrayOf(PropTypes.shape({
      createdBy: PropTypes.string,
      elementId: PropTypes.string,
      id: PropTypes.string,
      imageRegion: PropTypes.shape({
        id: PropTypes.string,
        imageId: PropTypes.string,
        specification: PropTypes.shape({
          boundingBox: PropTypes.shape({
            height: PropTypes.number,
            width: PropTypes.number,
            xmin: PropTypes.number,
            ymin: PropTypes.number,
          }).isRequired,
          polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
        }),
      }),
    })),
  }).isRequired,
  onPressDamage: PropTypes.func,
  options: PropTypes.shape({
    background: PropTypes.shape({
      opacity: PropTypes.number,
    }),
    ellipses: PropTypes.shape({
      opacity: PropTypes.number,
      stroke: PropTypes.shape({
        color: PropTypes.string,
        strokeWidth: PropTypes.number,
      }),
    }),
    label: PropTypes.shape({
      fontSize: PropTypes.number,
    }),
    polygons: PropTypes.shape({
      opacity: PropTypes.number,
      stroke: PropTypes.shape({
        color: PropTypes.string,
        strokeWidth: PropTypes.number,
      }),
    }),
  }),
};

DamageHighlight.defaultProps = {
  damages: [],
  damageStyle: () => {},
  onPressDamage: () => null,
  options: {},
};

export default DamageHighlight;
