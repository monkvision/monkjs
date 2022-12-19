import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { usePartSelectorComponents, useWireframeOffset } from './hooks';

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

export default function PartSelector({ orientation, isPartSelected, togglePart }) {
  const { offsetTop, offsetLeft } = useWireframeOffset({
    orientation,
    containerWidth: PART_SELECTOR_CONTAINER_WIDTH,
  });
  const { Wireframe, parts } = usePartSelectorComponents({ orientation });

  return (
    <View style={[styles.container]}>
      <Wireframe top={offsetTop} left={offsetLeft} />
      {parts.map((part) => (
        <part.Component
          key={part.key}
          offsetTop={offsetTop}
          offsetLeft={offsetLeft}
          onPress={() => togglePart(part.key)}
          isDisplayed={isPartSelected(part.key)}
        />
      ))}
    </View>
  );
}

PartSelector.propTypes = {
  isPartSelected: PropTypes.func.isRequired,
  orientation: PropTypes.number.isRequired,
  togglePart: PropTypes.func.isRequired,
};

PartSelector.defaultProps = {};
