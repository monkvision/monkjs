import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  View,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import ImageButton from './ImageButton';

const topLimitY = 145;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#232429',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    top: 650,
  },
  horizontalBarContent: {
    display: 'flex',
    alignItems: 'center',
    padding: 5,
  },
  horizontalBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5E5E62',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 16,
  },
  smallText: {
    opacity: 0.72,
    marginBottom: 5,
  },
});

function UpdateDamagePopUp({
  damage,
  damageMode,
  displayMode,
  imageCount,
  part,
  onDismiss,
  onShowGallery,
  style = {},
}) {
  const { t } = useTranslation();
  const { height: bottomLimitY } = useWindowDimensions();
  const [viewMode, setViewMode] = useState(null);
  const [gestureState, setGestureState] = useState({});
  const pan = useRef(new Animated.ValueXY({ x: 0, y: bottomLimitY })).current;

  const scrollIn = useCallback(() => {
    const toValue = viewMode === 'full' ? topLimitY : bottomLimitY / 1.8;
    Animated.timing(pan, {
      toValue: { x: 0, y: toValue },
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [viewMode, bottomLimitY]);

  const scrollOut = useCallback(() => {
    Animated.timing(pan, {
      toValue: { x: 0, y: bottomLimitY },
      duration: 200,
      useNativeDriver: true,
    }).start(onDismiss);
  }, [bottomLimitY]);

  const onRelease = useCallback(() => {
    if (viewMode === 'full' && gestureState.dy >= 0) {
      setViewMode('minimal');
    } else if (viewMode === 'minimal') {
      if (gestureState.dy <= 0) {
        setViewMode('full');
      } else {
        scrollOut();
      }
    }
  }, [viewMode, gestureState]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (event, gestureStat) => {
        if (gestureStat.moveY <= topLimitY) {
          pan.setValue({ x: 0, y: topLimitY });
        } else if (gestureStat.moveY >= bottomLimitY) {
          pan.setValue({ x: 0, y: bottomLimitY });
        } else {
          Animated.event([null, { moveX: pan.x, moveY: pan.y }])(event, gestureStat);
        }
      },
      onPanResponderRelease: (event, gestureStat) => {
        setGestureState({ dy: gestureStat.dy });
      },
    }),
  ).current;

  useEffect(() => {
    onRelease();
  }, [gestureState]);

  useEffect(() => {
    scrollIn();
  }, [viewMode]);

  useEffect(() => {
    setViewMode(displayMode);
  }, [displayMode]);

  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={scrollOut}>
        <View style={[styles.touchable]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.animatedContainer, { top: pan.y }]}>
        <View
          style={[styles.horizontalBarContent]}
          {...panResponder.panHandlers}
        >
          <View style={[styles.horizontalBar]} />
        </View>

        <View style={[styles.content]}>
          <Text style={[styles.text, styles.title]}>{t(`damageReport.parts.${part}`)}</Text>
          <ImageButton imageCount={imageCount} onPress={onShowGallery} />
        </View>

        <View style={[styles.content]}>
          <View style={[styles.textGroup]}>
            <Text style={[styles.text, styles.smallText]}>[Display Mode]</Text>
            <Text style={[styles.text, styles.subtitle]}>{`[${viewMode}]`}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

UpdateDamagePopUp.propTypes = {
  damage: PropTypes.shape({
    pricing: PropTypes.string,
    severity: PropTypes.string,
  }),
  damageMode: PropTypes.string,
  displayMode: PropTypes.string,
  imageCount: PropTypes.number,
  onDismiss: PropTypes.func,
  onShowGallery: PropTypes.func,
  part: PropTypes.string,
  style: PropTypes.object,
};

UpdateDamagePopUp.defaultProps = {
  damage: {
    pricing: '',
    severity: '',
  },
  damageMode: 'all',
  displayMode: 'minimal',
  imageCount: 0,
  onDismiss: () => {},
  onShowGallery: () => {},
  part: '',
  style: {},
};

export default UpdateDamagePopUp;
