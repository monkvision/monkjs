import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { useWireframe, useXMLParser } from './hooks';
import SVGComponentMapper from './svgComponentMapper';

const PART_SELECTOR_CONTAINER_WIDTH = 420;
const PART_SELECTOR_CONTAINER_HEIGHT_DIMENSION = [
  { screenHeightSpan: [0, 285], partSelectorHeight: 190 },
  { screenHeightSpan: [285, 310], partSelectorHeight: 190 },
  { screenHeightSpan: [310, 99999], partSelectorHeight: 235 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: PART_SELECTOR_CONTAINER_WIDTH,
  },
});

export default function PartSelector({ orientation, togglePart, isPartSelected, vehicleType }) {
  const { height } = useWindowDimensions();
  let wireframeXML = useWireframe({ orientation, vehicleType });
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
      wireframeXML = wireframeXML.replaceAll(`${key}"`, `${key}" ${newValue}`);
    });
  }
  const doc = useXMLParser(wireframeXML);

  const containerHeight = useMemo(
    () => PART_SELECTOR_CONTAINER_HEIGHT_DIMENSION
      .find(({ screenHeightSpan }) => screenHeightSpan[0] <= height
        && height < screenHeightSpan[1])?.partSelectorHeight ?? 235,
    [height],
  );
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

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <SVGComponentMapper
        element={svgElement}
        togglePart={togglePart}
        isPartSelected={isPartSelected}
      />
    </View>
  );
}

PartSelector.propTypes = {
  isPartSelected: PropTypes.func.isRequired,
  orientation: PropTypes.number.isRequired,
  togglePart: PropTypes.func.isRequired,
  vehicleType: PropTypes.string.isRequired,
};

PartSelector.defaultProps = {};
