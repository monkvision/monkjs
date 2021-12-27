import React, { createRef, useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Canvas from 'react-native-canvas';
import { Button } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

const color = '#000';
const margin = 0.8;

export default function Signature({ onSave, visible }) {
  const [previousX, setPreviousX] = useState('');
  const [previousY, setPreviousY] = useState('');
  const [currentX, setCurrentX] = useState('');
  const [currentY, setCurrentY] = useState('');
  const [drawFlag, setDrawFlag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const canvas = createRef();
  const isWeb = Platform.OS === 'web';
  const [w, h] = [Dimensions.get('window').width * margin, Dimensions.get('window').height * margin];

  const styles = StyleSheet.create({
    body: {
      flexDirection: 'column',
      alignSelf: 'center',
      justifyContent: 'space-around',
      height: Dimensions.get('window').height - useHeaderHeight(),
      width: 'min-content',
    },
  });

  const initialize = useCallback(() => {
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = w;
    canvas.current.height = h;
    ctx.strokeStyle = 'rgb(00, 00, 00)';
    ctx.strokeRect(0, 0, w, h);
    setIsOpen(true);
    setStrokeCount(0);
  }, [canvas, w, h]);

  useEffect(() => {
    if (visible && !isOpen) { initialize(); }
    if (!visible) { setIsOpen(false); }
  }, [initialize, isOpen, visible]);

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

  const save = useCallback(() => {
    onSave(canvas.current.toDataURL());
  }, [canvas, onSave]);

  if (!visible) { return <View />; }

  return (
    <View style={styles.body}>
      <View
        style={{ width: w, height: h, backgroundColor: '#fff' }}
        onMouseDown={onTouch}
        onMouseUp={onTouchEnd}
        onMouseMove={onMove}
        onTouchStart={onTouch}
        onTouchMove={onMove}
        onTouchEnd={onTouchEnd}
      >
        {isWeb ? <canvas ref={canvas} /> : <Canvas ref={canvas} />}
      </View>
      <Button disabled={strokeCount < 1} onPress={save} mode="contained">Save</Button>
      <Button onPress={initialize}>Clear</Button>
    </View>
  );
}

Signature.propTypes = {
  onSave: PropTypes.func,
  visible: PropTypes.bool,
};

Signature.defaultProps = {
  onSave: noop,
  visible: false,
};
