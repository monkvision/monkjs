import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Alert, Platform, StyleSheet, ScrollView, Text, Button } from 'react-native';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import Thumbnail from '../Thumbnail';
import Actions from '../../actions';

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    margin: 8,
    lineHeight: 20,
  },
  reset: {
    width: '100%',
    marginVertical: 16,
  },
});

export default function Sights({
  dispatch,
  ids,
  index,
  metadata,
  takenPictures,
}) {
  const { height: windowHeight } = useWindowDimensions();

  const handlePress = useCallback((id) => {
    dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: id });
  }, [dispatch]);

  const handleReset = useCallback(() => {
    const title = 'Are you sure?';
    const message = 'It will reset all taken pictures.';
    const updateState = () => dispatch({ type: Actions.sights.RESET_TOUR });

    // eslint-disable-next-line no-alert
    if (Platform.OS === 'web' && window.confirm(`${title} ${message}`)) {
      updateState();
    }

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: updateState },
    ]);
  }, [dispatch]);

  return (
    <ScrollView
      endFillColor="#000"
      showsHorizontalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      contentContainerStyle={Platform.select({
        native: { maxHeight: windowHeight },
        default: { maxHeight: '100vh' },
      })}
    >
      <Text style={styles.text}>
        {`${index} / ${ids.length} `}
      </Text>
      {metadata.map(({ id, label, overlay }) => (
        <Thumbnail
          key={`thumbnail-${id}`}
          label={label}
          overlay={overlay}
          picture={takenPictures[id]}
          onPress={() => handlePress(id)}
          onClick={() => handlePress(id)}
        />
      ))}
      <Button
        style={styles.reset}
        onPress={handleReset}
        title="Reset"
        color="black"
      />
    </ScrollView>
  );
}

Sights.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number,
  metadata: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    overlay: PropTypes.string,
  })).isRequired,
  takenPictures: PropTypes.objectOf(PropTypes.object),
};

Sights.defaultProps = {
  index: 0,
  takenPictures: {},
};
