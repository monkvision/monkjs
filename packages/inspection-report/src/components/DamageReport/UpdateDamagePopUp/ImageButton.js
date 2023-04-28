import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#5D5E67',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
});

function ImageButton({ imageCount, onPress }) {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <MaterialIcons style={[styles.icon]} name="photo-library" size={16} color="#ffffff" />
      <Text style={[styles.text]}>{imageCount}</Text>
    </TouchableOpacity>
  );
}

ImageButton.propTypes = {
  imageCount: PropTypes.number,
  onPress: PropTypes.func,
};
ImageButton.defaultProps = {
  imageCount: 0,
  onPress: () => {},
};

export default ImageButton;
