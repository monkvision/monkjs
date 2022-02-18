/* eslint-disable react/prop-types */
import React, { createRef, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, PanResponder, Platform, StyleSheet, View } from 'react-native';
import Canvas from 'react-native-canvas';
import { Button, useTheme } from 'react-native-paper';

import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;
const color = '#000';
const margin = 0.8;

const { width, height } = Dimensions.get('window');
const w = width * margin;
const h = height * margin;

const styles = StyleSheet.create({
  body: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'space-around',
    marginVertical: spacing(1),
  },
  canvas: {
    width: w,
    height: h,
    backgroundColor: '#fff',
    maxWidth: 300,
    maxHeight: 300,
    position: 'relative',
  },
  clearbutton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },
});
export default forwardRef(({ visible, setScrollEnabled }, ref) => {
  const [previousX, setPreviousX] = useState('');
  const [previousY, setPreviousY] = useState('');
  const [currentX, setCurrentX] = useState('');
  const [currentY, setCurrentY] = useState('');
  const [drawFlag, setDrawFlag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const { colors } = useTheme();
  const canvas = createRef();
  const isWeb = Platform.OS === 'web';

  const handleClear = useCallback(() => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = 300;
    canvas.current.height = 300;
    ctx.strokeStyle = 'rgb(00, 00, 00)';
    ctx.strokeRect(0, 0, 300, 300);
    setIsOpen(true);
    setStrokeCount(0);
  }, [canvas]);

  useEffect(() => {
    if (visible && !isOpen) { handleClear(); }
    if (!visible) { setIsOpen(false); }
  }, [handleClear, isOpen, visible]);

  const moveCursor = useCallback((nativeEvent) => {
    if (isWeb) {
      setPreviousX(nativeEvent.offsetX);
      setPreviousY(nativeEvent.offsetY);
    } else {
      setPreviousX(nativeEvent.locationX);
      setPreviousY(nativeEvent.locationY);
    }
  }, [isWeb]);

  const onMove = useCallback((e) => {
    if (!drawFlag) { return; }
    const ctx = canvas.current.getContext('2d');
    ctx.beginPath();

    if (currentX === '') {
      setPreviousX(previousX);
      setPreviousY(previousY);
    } else {
      moveCursor(e.nativeEvent);
      ctx.moveTo(previousX, previousY);
    }

    ctx.lineTo(currentX, currentY);
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();

    setCurrentX(previousX);
    setCurrentY(previousY);
  }, [canvas, currentX, currentY, drawFlag, moveCursor, previousX, previousY]);

  const onTouch = useCallback((e) => {
    setStrokeCount((prevState) => prevState + 1);
    setDrawFlag(true);
    moveCursor(e.nativeEvent);
  }, [moveCursor]);

  const onTouchEnd = useCallback(() => {
    setDrawFlag(false);
    setPreviousX('');
    setPreviousY('');
    setCurrentX('');
    setCurrentY('');
  }, []);

  useImperativeHandle(ref, () => ({
    getStrokeLength: () => strokeCount,
    getUri: async () => {
      const uri = await canvas.current.toDataURL();
      return uri;
    },
    handleClear,
  }));

  // disable/enable scroll when drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => setScrollEnabled(false),
      onPanResponderRelease: () => setScrollEnabled(true),
      onPanResponderTerminate: () => setScrollEnabled(true),
    }),
  ).current;

  if (!visible) { return <View />; }

  return (
    <View style={styles.body}>
      <View
        {...panResponder.panHandlers}
        style={styles.canvas}
        onMouseDown={onTouch}
        onMouseUp={onTouchEnd}
        onMouseMove={onMove}
        onTouchStart={onTouch}
        onTouchMove={onMove}
        onTouchEnd={onTouchEnd}
      >
        <Button mode="outlined" icon="eraser-variant" color={colors.primary} style={styles.clearbutton} onPress={handleClear}>
          Clear
        </Button>
        {isWeb ? <canvas ref={canvas} /> : <Canvas ref={canvas} />}
      </View>
    </View>
  );
});
