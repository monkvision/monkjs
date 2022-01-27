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
  current,
  dispatch,
  hideReset,
  ids,
  onReset,
  takenPictures,
  tour,
}) {
  const { height: windowHeight } = useWindowDimensions();

  const handlePress = useCallback((id) => {
    dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
  }, [dispatch]);

  const handleReset = useCallback(() => {
    const title = 'Are you sure?';
    const message = 'It will reset all taken pictures.';
    const updateState = () => {
      dispatch({ type: Actions.sights.RESET_TOUR, payload: ids });
      onReset();
    };

    // eslint-disable-next-line no-alert
    if (Platform.OS === 'web' && window.confirm(`${title} ${message}`)) {
      updateState();
    }

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: updateState },
    ]);
  }, [dispatch, ids, onReset]);

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
        {`${current.index + 1} / ${ids.length} `}
      </Text>
      {Object.values(tour).map(({ id, label, overlay }) => (
        <Thumbnail
          key={`thumbnail-${id}`}
          label={label}
          overlay={overlay}
          picture={takenPictures[id]}
          onPress={() => handlePress(id)}
          onClick={() => handlePress(id)}
        />
      ))}
      {!hideReset && (
        <Button
          style={styles.reset}
          onPress={handleReset}
          title="Reset"
          color="black"
        />
      )}
    </ScrollView>
  );
}

Sights.propTypes = {
  current: PropTypes.shape({ index: PropTypes.number }).isRequired,
  dispatch: PropTypes.func.isRequired,
  hideReset: PropTypes.bool,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReset: PropTypes.func,
  takenPictures: PropTypes.objectOf(PropTypes.object),
  tour: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    overlay: PropTypes.string,
  })).isRequired,
};

Sights.defaultProps = {
  hideReset: false,
  onReset: () => {},
  takenPictures: {},
};
