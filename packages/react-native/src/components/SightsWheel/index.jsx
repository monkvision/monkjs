import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';

import Svg, { Circle, Path } from 'react-native-svg';
import { Sight } from '@monkvision/corejs';

import sightsWheelCarPng from '../../assets/sights-wheel-car.png';

const externalSize = 116; // in pixels, the complete size of the wheel and the spacing around it
const makeStyles = ({ colors }) => ({
  externalSize,
  outerCircleRadius: 100 / externalSize / 2, // between 0 and 0.5 (there would be no spacing)
  innerCircleRadius: 0.7 * (100 / externalSize / 2), // between 0 and outerCircleRadius
  circleBackground: 'white',
  activeBackground: colors.accent,
  activeBorder: 'white',
  activeBorderWidth: '0.016',
  filledBackground: colors.primary,
  filledBorder: 'grey',
  filledBorderWidth: '0.008',
  emptyBackground: 'white',
  emptyBorder: 'grey',
  emptyBorderWidth: '0',
});

/* We can probably do this in a better way, maybe using https://lodash.com/docs/#range and .map? */
const mapRange = (count, func) => [...Array(count).keys()].map(func);
const svgPoint = (point) => `${point.x},${point.y}`;
const degrees = (radianAngle) => radianAngle * (180 / Math.PI);

/**
 * Compute the geometry of the sections around the SightsWheel, return them as an array of svg path
 * data.
 * Each section is an independent path, a symbol could have been used and rotated around but there
 * would be less flexibility to customize each section.
 * @param sectionCount the number of sections around the wheel
 * @param startsInFront is true iff the first section is in front of the vehicle
 * @param innerCircleRadius
 * @param outerCircleRadius
 * @returns {[string]}
 */
function getWheelSectionsPathData(
  sectionCount,
  startsInFront = true,
  innerCircleRadius,
  outerCircleRadius,
) {
  const sectionAngle = (2 * Math.PI) / sectionCount;
  const startAngle = startsInFront
    ? -(Math.PI + sectionAngle) / 2
    : -Math.PI / 2;

  const sectionCorners = mapRange(sectionCount, (sectionIndex) => {
    const x = startAngle + sectionIndex * sectionAngle;
    const baseX = Math.cos(x);
    const baseY = Math.sin(x);

    return {
      inner: { x: innerCircleRadius * baseX, y: innerCircleRadius * baseY },
      outer: { x: outerCircleRadius * baseX, y: outerCircleRadius * baseY },
    };
  });

  return mapRange(sectionCount, (sectionIndex) => {
    const nextSectionIndex = (sectionIndex + 1) % sectionCount;

    return (
      `M${svgPoint(sectionCorners[sectionIndex].outer)}
       A${outerCircleRadius} ${outerCircleRadius} ${degrees(sectionAngle)} 0 1 ${svgPoint(sectionCorners[nextSectionIndex].outer)}
       L${svgPoint(sectionCorners[nextSectionIndex].inner)}
       A${innerCircleRadius} ${innerCircleRadius} ${-degrees(sectionAngle)} 0 0 ${svgPoint(sectionCorners[sectionIndex].inner)}
       z`
    );
  });
}

const sectionSvgProps = (isActive, isFilled, style) => {
  const svgPropSwitch = (propSuffix) => {
    const prefix = isActive
      ? 'active'
      : (isFilled && 'filled') || 'empty';

    return style[`${prefix}${propSuffix}`];
  };

  return {
    fill: svgPropSwitch('Background'),
    stroke: svgPropSwitch('Border'),
    strokeWidth: svgPropSwitch('BorderWidth'),
  };
};

/**
 * A component to represents sights, in different states, around a vehicle.
 *
 * @param activeSightId {string}
 *    the (optional) id of a sight whose section will get style with the 'active'
 * @param children {node}
 *    the center of the wheel, would typically contain a vehicle
 * @param filledSightIds {[string]}
 *    an array of sight ids, each sight whose id is included
 *    get the applied the 'filled' style from style (other sections get the 'empty' style)
 * @param sights {[Sight]}
 *    the ordered array of Sights to represent,
 *    each sight will be represented by a section around the wheel
 * @param theme {{ colors: { accent: string, primary: string }}}
 *    the ordered array of Sights to represent,
 *    each sight will be represented by a section around the wheel
 * @returns {JSX.Element}
 * @constructor
 */
function SightsWheel({
  activeSightId,
  filledSightIds,
  sights,
  theme,
}) {
  const styles = makeStyles(theme);

  const [sightsCount, startsInFront] = useMemo(
    () => [sights.length, sights[0]?.poz?.o === 0],
    [sights],
  );

  const wheelSectionsPathData = useMemo(
    () => getWheelSectionsPathData(
      sightsCount, startsInFront, styles.innerCircleRadius, styles.outerCircleRadius,
    ),
    [sightsCount, startsInFront, styles],
  );

  // We memoize the sections components for performances
  const SectionComponents = useMemo(() => {
    const filledSightIdsSet = new Set(filledSightIds);

    return sights.map((sight, sightIndex) => {
      const colorProps = sectionSvgProps(
        activeSightId === sight.id,
        filledSightIdsSet.has(sight.id),
        styles,
      );

      return (
        <Path
          {...colorProps}
          d={wheelSectionsPathData[sightIndex]}
          id={sight.id}
          key={sight.id}
        />
      );
    });
  }, [sights, filledSightIds, activeSightId, styles, wheelSectionsPathData]);

  return (
    <View>
      <Svg width={styles.externalSize} height={styles.externalSize} viewBox="-0.5 -0.5 1 1">
        <Circle cx={0} cy={0} r={styles.outerCircleRadius} fill={styles.circleBackground} />
        {SectionComponents}
      </Svg>
      <Image
        source={{ uri: sightsWheelCarPng }}
        style={{
          width: 60,
          height: 60,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [
            { translateX: '-50%' },
            { translateY: '-50%' },
          ],
        }}
      />
    </View>
  );
}

SightsWheel.propTypes = {
  activeSightId: PropTypes.string.isRequired,
  filledSightIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  sights: PropTypes.arrayOf(PropTypes.shape(Sight)).isRequired,
  theme: PropTypes.shape({ colors: {
    accent: PropTypes.string,
    primary: PropTypes.string,
  } }),
};

SightsWheel.defaultProps = {
  theme: { colors: { accent: '#7af7ff', primary: '#274b9f' } },
};

export default SightsWheel;
