import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import { ClipPath, Defs, Ellipse, Polygon, Svg, Text } from 'react-native-svg';
import { Platform } from 'react-native';
import DamageImage from '../DamageImage';
import useSvgToImage from '../../hooks/useSvgToImage';

export const DEFAULT_OPTIONS = {
  background: {
    opacity: 0.35,
  },
  label: {
    fontSize: 5,
  },
  polygons: {
    opacity: 1,
    stroke: {
      strokeWidth: 2.5,
    },
  },
  ellipses: {
    opacity: 1,
    stroke: {
      strokeWidth: 2.5,
    },
  },
};

const DamageHighlight = forwardRef(({
  damages,
  image,
  options,
  onPressDamage,
  ...passThroughProps
}, ref) => {
  const [svgRef, setSvgRef] = useState(null);
  const toImage = useSvgToImage();

  const measureText = useCallback((str, fontSize) => {
    // eslint-disable-next-line max-len
    const widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
    const avg = 0.5279276315789471;
    return str
      .split('')
      .map((c) => (c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg))
      .reduce((cur, acc) => acc + cur) * fontSize;
  }, []);

  const checkCollisions = (lb1, lb2) => {
    if (lb1.x + lb1.width >= lb2.x
      && lb1.x + lb1.width <= lb2.x + lb2.width
      && lb1.y + lb1.height >= lb2.y
      && lb1.y + lb1.height <= lb2.y + lb2.height) {
      return true;
    }

    return (lb1.x >= lb2.x
      && lb1.x <= lb2.x + lb2.width
      && lb1.y >= lb2.y
      && lb1.y <= lb2.y + lb2.height);
  };

  const renderDamages = useCallback(() => {
    const damageFigures = [];
    const labels = [];
    const polygonsLabel = [];

    damages.forEach((damage) => {
      const { ellipse, damageType, polygons } = damage;
      const { ellipses: ellipsesStyle, polygons: polygonsStyle, label } = options;

      const strokeType = (polygons ? polygonsStyle : ellipsesStyle);

      const strokes = {
        stroke: strokeType.stroke.color,
        strokeDasharray: damageType === 'dent' ? '5, 5' : '',
        strokeWidth: strokeType.stroke.strokeWidth,
      };

      const boundingBox = {
        xMin: !polygons ? (ellipse.cx - ellipse.rx) : polygons.reduce((xMinPolygon, p) => (
          Math.min(p.reduce((xMin, points) => (
            Math.min(points[0], xMin)
          ), Number.MAX_VALUE), xMinPolygon)), Number.MAX_VALUE),
        yMin: !polygons ? (ellipse.cy - ellipse.ry) : polygons.reduce((yMinPolygon, p) => (
          Math.min(p.reduce((yMin, points) => (
            Math.min(points[1], yMin)
          ), Number.MAX_VALUE), yMinPolygon)), Number.MAX_VALUE),
        yMax: !polygons ? (ellipse.cy - ellipse.ry) : polygons.reduce((yMaxPolygon, p) => (
          Math.max(p.reduce((yMax, points) => (
            Math.max(points[1], yMax)
          ), 0), yMaxPolygon)), 0),
      };

      const labelPosition = {
        x: boundingBox.xMin,
        y: ((boundingBox.yMin - label.fontSize) <= 0
          ? boundingBox.yMax
          : boundingBox.yMin) - label.fontSize / 2,
        textAnchor:
          (boundingBox.xMin + measureText(damageType, label.fontSize)) >= image.width
            ? 'end'
            : 'start',
      };

      const labelInfo = {
        ...labelPosition,
        width: measureText(damageType, label.fontSize),
        height: label.fontSize,
        damageType,
        color: label.color,
      };

      const collision = polygonsLabel.filter((lb) => checkCollisions(labelInfo, lb));

      const t = (collision
        .map((c) => c.damageType === damageType)
        .reduce((prev, curr) => prev || curr, false)) === false;

      if ((collision.length <= 0) || t) {
        while (polygonsLabel.filter((lb) => checkCollisions(labelInfo, lb)).length > 0) {
          labelPosition.y -= label.fontSize;
          labelInfo.y -= label.fontSize;
        }
        polygonsLabel.push(labelInfo);

        labels.push(
          <Text
            paintOrder="stroke"
            stroke={label.color}
            strokeWidth={5}
            fill="white"
            fontSize={label.fontSize}
            {...labelPosition}
          >
            {`${damageType.charAt(0)
              .toUpperCase() + damageType.slice(1)
              .replaceAll('_', ' ')}`}
          </Text>,
        );
      }

      if (polygons) {
        polygons.forEach((p, index) => {
          damageFigures.push(
            <Polygon
              {...strokes}
              key={`image-${image.id}-polygon-${String(index)}`}
              fillOpacity={0}
              points={p.map((card) => `${card[0]},${card[1]}`).join(' ')}
              onClick={() => onPressDamage(damage)}
              onPress={() => onPressDamage(damage)}
            />,
          );
        });
      }

      if (ellipse) {
        damageFigures.push(<Ellipse
          {...ellipse}
          {...strokes}
          key={`image-${image.id}-damage-${damage.id}-ellipse`}
          fillOpacity={0}
          onClick={() => onPressDamage(damage)}
          onPress={() => onPressDamage(damage)}
        />);
      }
    });

    return [damageFigures, labels];
  }, [damages, image.id, image.width, measureText, onPressDamage, options]);

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
        opacity={isEmpty(Polygons) ? 1 : options.background.opacity}
      />
      {Labels}
      <DamageImage name={image.id} source={image.source} clip opacity={options.polygons.opacity} />
      {Polygons}
    </Svg>
  );
});

DamageHighlight.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.shape({
    damageType: PropTypes.string,
    ellipse: PropTypes.shape({
      cx: PropTypes.number,
      cy: PropTypes.number,
      rx: PropTypes.number,
      ry: PropTypes.number,
    }),
    id: PropTypes.string,
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
    label: {
      fontSize: PropTypes.number,
    },
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
  options: DEFAULT_OPTIONS,
  onPressDamage: null,
};

export default DamageHighlight;
