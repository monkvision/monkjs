import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CarOrientation, RepairOperation, VehicleType } from '../../resources';
import { useOrientation, ORIENTATION_MODE } from '../../hooks';
import { useCarView360Wireframe, useXMLParser } from './hooks';
import SVGElementMapper from './SVGElementMapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function CarView360({
  orientation,
  vehicleType,
  damages,
  width,
  height,
  getPartAttributes,
  onPressPart,
  onPressPill,
}) {
  const wireframeXML = useCarView360Wireframe({ orientation, vehicleType });
  const windowOrientation = useOrientation();
  const doc = useXMLParser(wireframeXML);
  const svgElement = useMemo(() => {
    const svg = doc.children[0];
    if (svg.tagName !== 'svg') {
      throw new Error('Invalid Part View 360 SVG: expected <svg> tag as the first children of XML document.');
    }
    return svg;
  }, [doc]);
  const displayedDamages = useMemo(
    () => damages.filter((dmg) => (
      (!!dmg.pricing && !!dmg.severity) || (dmg.repairOperation === RepairOperation.REPLACE)
    )),
    [damages],
  );
  const maxWidth = useMemo(
    () => (windowOrientation === ORIENTATION_MODE.Landscape ? '50%' : '100%'),
    [windowOrientation],
  );

  return (
    <View style={[styles.container, { width, height, maxWidth }]}>
      <SVGElementMapper
        element={svgElement}
        damages={displayedDamages}
        getPartAttributes={getPartAttributes}
        onPressPart={onPressPart}
        onPressPill={onPressPill}
      />
    </View>
  );
}

CarView360.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.shape({
    part: PropTypes.string.isRequired,
    pricing: PropTypes.number,
    repairOperation: PropTypes.oneOf(Object.values(RepairOperation)),
    severity: PropTypes.oneOf(['low', 'medium', 'high']),
  })),
  getPartAttributes: PropTypes.func,
  height: PropTypes.number,
  onPressPart: PropTypes.func,
  onPressPill: PropTypes.func,
  orientation: PropTypes.oneOf(Object.values(CarOrientation)).isRequired,
  vehicleType: PropTypes.oneOf(Object.values(VehicleType)).isRequired,
  width: PropTypes.number,
};

CarView360.defaultProps = {
  damages: [],
  getPartAttributes: () => {},
  height: undefined,
  onPressPart: () => {},
  onPressPill: () => {},
  width: undefined,
};
