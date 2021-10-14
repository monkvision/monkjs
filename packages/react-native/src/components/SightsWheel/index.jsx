import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Sight from '@monkvision/corejs/src/classes/Sight';
import Svg, { Circle, Path } from 'react-native-svg';

const defaultWheelStyle = {
  externalSize: 94, // in pixels, the complete size of the wheel and the spacing around it
  outerCircleRadius: 54 / 94 / 2, // between 0 and 0.5 (there would be no spacing around the wheel)
  innerCircleRadius: 0.7 * (54 / 94 / 2), // between 0 and outerCircleRadius
  circleBackground: 'white',
  activeBackground: 'green',
  activeBorder: 'green',
  activeBorderWidth: '0.016',
  filledBackground: 'blue',
  filledBorder: 'light blue',
  filledBorderWidth: '0.008',
  emptyBackground: 'white',
  emptyBorder: 'grey',
  emptyBorderWidth: '0',
};

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
  sectionCount, startsInFront = true, innerCircleRadius, outerCircleRadius,
) {
  const sectionAngle = (2 * Math.PI) / sectionCount;
  const startAngle = startsInFront ? -(Math.PI + sectionAngle) / 2 : -Math.PI / 2;

  const sectionCorners = mapRange(sectionCount, (sectionIndex) => {
    const baseX = Math.cos(startAngle + sectionIndex * sectionAngle);
    const baseY = Math.sin(startAngle + sectionIndex * sectionAngle);
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

const sectionSvgProps = (isActive, isFilled, wheelStyle) => {
  const svgPropSwitch = (propSuffix) => {
    const prefix = isActive ? 'active' : (isFilled && 'filled') || 'empty'; // just one ternary :)
    return wheelStyle[`${prefix}${propSuffix}`];
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
 * @param sights the ordered array of Sights to represent, each sight will be represented by a
 *  section around the wheel
 * @param filledSightIds an array of sight ids, each sight whose id is included get the applied the
 *  'filled' style from wheelStyle (other sections get the 'empty' style)
 * @param activeSightId the (optional) id of a sight whose section will get style with the 'active'
 *  style from wheelStyle (overriding 'filled' if present)
 * @param wheelStyle the styling of the wheel, see defaultWheelStyle for an example
 * @param children the center of the wheel, would typically contain a vehicle
 * @returns {JSX.Element}
 */
function SightsWheel({ sights, filledSightIds, activeSightId, wheelStyle, children }) {
  const [sightsCount, startsInFront] = useMemo(
    () => [sights.length, sights[0]?.poz?.o === 0], [sights],
  );

  const wheelSectionsPathData = useMemo(
    () => getWheelSectionsPathData(
      sightsCount, startsInFront, wheelStyle.innerCircleRadius, wheelStyle.outerCircleRadius,
    ), [sightsCount, startsInFront, wheelStyle],
  );

  // We memoize the sections components for performances
  const SectionComponents = useMemo(() => {
    const filledSightIdsSet = new Set(filledSightIds);
    return sights.map((sight, sightIndex) => {
      const colorProps = sectionSvgProps(
        activeSightId === sight.id, filledSightIdsSet.has(sight.id), wheelStyle,
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
  }, [sights, filledSightIds, activeSightId, wheelStyle, wheelSectionsPathData]);

  return (
    <>
      <Svg width={wheelStyle.externalSize} height={wheelStyle.externalSize} viewBox="-0.5 -0.5 1 1">
        <Circle cx={0} cy={0} r={wheelStyle.outerCircleRadius} fill={wheelStyle.circleBackground} />
        {SectionComponents}
      </Svg>
      {
        /* :TODO: needs to be moved between the circle and the section components, probably with a
              z-index and a position? */
        children
      }
    </>
  );
}

SightsWheel.defaultProps = {
  activeSightId: null,
  wheelStyle: defaultWheelStyle,
};

SightsWheel.propTypes = {
  activeSightId: PropTypes.string,
  filledSightIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  sights: PropTypes.arrayOf(PropTypes.shape(Sight)).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  wheelStyle: PropTypes.object, // :TODO: specify this
};

export default SightsWheel;
