import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Alert, Platform, StyleSheet, ScrollView, Text, Button, Switch, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useMediaQuery } from 'react-responsive';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import useToggle from '../../hooks/useToggle';

import Thumbnail from '../Thumbnail';
import Actions from '../../actions';

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
  },
  reset: {
    width: '100%',
    marginVertical: 16,
  },
  switchContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  switchText: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  stickyHeader: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
  },
  hidden: {
    visibility: 'hidden',
    opacity: 0,
  },
});

function Gradient() {
  const isSmallScreen = useMediaQuery({ maxWidth: 720 });

  const size = useMemo(() => {
    if (isSmallScreen) { return { height: 75, width: 100 }; }
    return { height: 75, width: 125 };
  }, [isSmallScreen]);

  return (
    <Svg {...size} xmlns="http://www.w3.org/2000/svg" style={styles.gradient}>
      <Defs>
        <LinearGradient id="stickyHeaderGradient" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="5%" stopColor="black" />
          <Stop offset="95%" stopColor="transparent" />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#stickyHeaderGradient)" x="0" y="0" width="100%" height="100%" />
    </Svg>
  );
}

export default function Sights({
  buttonResetProps,
  current,
  dispatch,
  ids,
  onOffline,
  onReset,
  takenPictures,
  tour,
}) {
  const { height: windowHeight } = useWindowDimensions();

  const [isOnline, , , toggleOnline] = useToggle(true);
  const onlineText = useMemo(
    () => `${isOnline ? 'online' : 'offline'}`,
    [isOnline],
  );

  const handleOffline = useCallback((value) => {
    onOffline(!value);
    toggleOnline();
  }, [onOffline, toggleOnline]);

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
      <View style={styles.stickyHeader}>
        <Gradient />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`${current.index + 1} / ${ids.length} `}
          </Text>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            onValueChange={handleOffline}
            value={isOnline}
          />
          <Text style={styles.switchText}>{onlineText}</Text>
        </View>
      </View>
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
      {!buttonResetProps.hidden && (
        <Button
          onPress={handleReset}
          title="Reset"
          color="black"
          disabled={buttonResetProps.hidden}
          style={[styles.reset, buttonResetProps.hidden ? styles.hidden : {}]}
          {...buttonResetProps}
        />
      )}
    </ScrollView>
  );
}

Sights.propTypes = {
  buttonResetProps: PropTypes.objectOf(PropTypes.any),
  current: PropTypes.shape({ index: PropTypes.number }).isRequired,
  dispatch: PropTypes.func.isRequired,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOffline: PropTypes.func,
  onReset: PropTypes.func,
  takenPictures: PropTypes.objectOf(PropTypes.object),
  tour: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    overlay: PropTypes.string,
  })).isRequired,
};

Sights.defaultProps = {
  buttonResetProps: [],
  onOffline: () => {},
  onReset: () => {},
  takenPictures: {},
};
