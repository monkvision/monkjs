import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { useWireframe, useXMLParser } from './hooks';
import SVGComponentMapper from './SVGComponentMapper';

const PART_SELECTOR_CONTAINER_WIDTH = 420;
const PART_SELECTOR_CONTAINER_HEIGHT = 235;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    width: PART_SELECTOR_CONTAINER_WIDTH,
    height: PART_SELECTOR_CONTAINER_HEIGHT,
  },
});

export default function PartSelector({ orientation, togglePart, isPartSelected }) {
  // TODO : Replace the hard-coded vehicleType
  const wireframeXML = useWireframe({ orientation, vehicleType: 'cuv' });
  const doc = useXMLParser(wireframeXML);
  const svgElement = useMemo(() => {
    const svg = doc.children[0];
    if (svg.tagName !== 'svg') {
      throw new Error('Invalid part selector SVG format: expected <svg> tag as the first children of XML document');
    }
    return svg;
  }, [doc]);

  return (
    <View style={[styles.container]}>
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
};

PartSelector.defaultProps = {};
