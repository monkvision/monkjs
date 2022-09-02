import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import { ClipPath, Defs, Ellipse, Polygon, Svg } from 'react-native-svg';
import { Platform } from 'react-native';
import DamageImage from '../DamageImage';
import useSvgToImage from '../../hooks/useSvgToImage';

export const DEFAULT_OPTIONS = {
  background: {
    opacity: 1,
  },
  label: {
    fontSize: 5,
  },
  polygons: {
    opacity: 1,
    stroke: {
      color: 'yellow',
      strokeWidth: 2.5,
    },
  },
  ellipses: {
    opacity: 1,
    stroke: {
      color: 'yellow',
      strokeWidth: 2.5,
    },
  },
};

const ElementHighlight = forwardRef(({
  elements,
  image,
  options,
  onPressElement,
  ...passThroughProps
}, ref) => {
  const [svgRef, setSvgRef] = useState(null);
  const toImage = useSvgToImage();
  const completedOptions = { ...DEFAULT_OPTIONS, ...options };

  const renderDamages = useCallback(() => {
    const damageFigures = [];
    const labels = [];

    elements.forEach((element) => {
      const { ellipses, id, polygons } = element;
      const { ellipses: ellipsesStyle, polygons: polygonsStyle } = completedOptions;

      const strokeType = (polygons ? polygonsStyle : ellipsesStyle);

      const strokes = {
        stroke: strokeType.stroke.color,
        // strokeDasharray: damageType === 'dent' ? '5, 5' : '',
        strokeWidth: strokeType.stroke.strokeWidth,
      };

      const onPressEvent = Platform.select({
        web: { onClick: () => onPressElement(element) },
        native: { onPress: () => onPressElement(element) },
      });

      if (polygons && polygons.length > 0) {
        polygons.forEach((p, index) => {
          damageFigures.push(
            <Polygon
              {...strokes}
              {...onPressEvent}
              key={`image-${image.id}-polygon-${id}-${String(index)}`}
              fillOpacity={0}
              points={p.map((card) => `${card[0]},${card[1]}`).join(' ')}
              {...element.elementStyle ?? {}}
            />,
          );
        });
      }

      if (ellipses && ellipses.length > 0) {
        ellipses.forEach((ellipse) => {
          damageFigures.push(<Ellipse
            {...ellipse}
            {...strokes}
            {...onPressEvent}
            key={`image-${image.id}-damage-${element.id}-ellipse`}
            fillOpacity={0}
            {...element.damageStyle ?? {}}
          />);
        });
      }
    });

    return [damageFigures, labels];
  }, [elements, image.id, image.width, completedOptions]);

  const [Polygons, Labels] = renderDamages();

  useImperativeHandle(ref, () => ({
    toImage: () => (
      Platform.OS === 'native'
        ? toImage(svgRef, image.width, image.height)
        : toImage(image)),
  }));

  return (
    <Svg
      id={`svg-${image.id}`}
      ref={(rf) => setSvgRef(rf)}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${image.width} ${image.height}`}
      {...passThroughProps}
    >
      <Defs>
        <ClipPath id={`clip${image.id}`}>{Polygons}</ClipPath>
      </Defs>
      {/* Show background image with a low opacity */}
      <DamageImage
        name={image.id}
        source={image.source}
        opacity={isEmpty(Polygons) ? 1 : completedOptions.background.opacity}
      />
      {Labels}
      <DamageImage
        name={image.id}
        source={image.source}
        clip
        opacity={completedOptions.polygons.opacity}
      />
      {Polygons}
    </Svg>
  );
});

ElementHighlight.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    elementStyle: PropTypes.shape({
      stroke: PropTypes.string,
      strokeDasharray: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
    elementType: PropTypes.string,
    ellipses: PropTypes.arrayOf(PropTypes.shape({
      cx: PropTypes.number,
      cy: PropTypes.number,
      rx: PropTypes.number,
      ry: PropTypes.number,
    })),
    id: PropTypes.string.isRequired,
    polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
  })),
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    width: PropTypes.number,
  }).isRequired,
  onPressElement: PropTypes.func,
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

ElementHighlight.defaultProps = {
  elements: [],
  options: DEFAULT_OPTIONS,
  onPressElement: () => null,
};

export default ElementHighlight;
