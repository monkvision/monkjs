import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

import { CarOrientation, RepairOperation, VehicleType } from '../../resources';
import { useOrientation, ORIENTATION_MODE } from '../../hooks';
import { useCarView360Wireframe, useXMLParser } from './hooks';
import SVGElementMapper from './svgElementMapper';

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
  let wireframeXML = useCarView360Wireframe({ orientation, vehicleType });
  if (Platform.OS !== 'web') {
    const svgStyles = wireframeXML.substring(wireframeXML.indexOf('<style>') + '<style>'.length + 1, wireframeXML.indexOf('</style>'));
    const elements = svgStyles.split('.');
    const styleDict = {};
    let classNames = [];
    elements.forEach((element) => {
      if (element.includes('{')) {
        const style = element.substring(element.indexOf('{') + 1, element.indexOf('}'));
        classNames.push(element.substring(0, element.indexOf('{')).replace(/[,.]/g, ''));
        classNames.forEach((name) => {
          const prev = styleDict[name] ? `${styleDict[name]};` : '';
          styleDict[name] = `${prev}${style};`;
        });
        classNames = [];
      } else {
        classNames.push(element.replace(/[,.]/g, ''));
      }
    });

    Object.keys(styleDict).forEach((key) => {
      const newValue = styleDict[key].split(';').filter((value) => value.length !== 0).map((element) => {
        const separatorIndex = element.indexOf(':');
        const value = element.substring(separatorIndex + 1, element.length);
        const name = element.substring(0, separatorIndex);
        return `${name} = "${value}"`;
      }).reduce(
        (accumulator, currentValue) => `${accumulator} ${currentValue}`,
        '',
      );
      wireframeXML = wireframeXML.replaceAll(`class="${key}`, `${newValue} class="${key}`);
    });
  }
  const windowOrientation = useOrientation();
  const doc = useXMLParser(wireframeXML);
  const svgElement = useMemo(() => {
    let svg;
    if (Platform.OS === 'web') {
      svg = doc.children[0];
    } else {
      svg = doc.childNodes[1] ?? doc.childNodes[0];
    }
    if (svg.tagName !== 'svg') {
      throw new Error('Invalid part selector SVG format: expected <svg> tag as the first children of XML document');
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
