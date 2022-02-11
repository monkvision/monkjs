import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

const DELAY_TAP = 300;

export default function useDamageHighlightEvents({ touchable, ratioX, ratioY }) {
  const [press, setPress] = useState(false);
  const [showPolygon, setShowPolygon] = useState(true);
  const [lastPress, setLastPress] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });

  // on touch releases
  const handleTouchUp = useCallback(({ x, y }) => {
    setPress(false);
    setShowPolygon(true);
    const now = Date.now();

    if (lastPress && now - lastPress < DELAY_TAP) {
      setZoom((prevState) => (prevState === 1 ? 0.35 : 1));
      if (zoom === 1) {
        setPosition({ x: (x - 100) * ratioX, y: (y - 100) * ratioY });
      } else { setPosition({ x: 0, y: 0 }); }
    } else { setLastPress(now); }
  }, [lastPress, ratioX, ratioY, zoom]);

  // on touch start
  const handleTouchDown = useCallback(({ x, y }) => {
    setPress(true);
    setShowPolygon(false);
    setOriginPosition({ x, y });
  }, []);

  // get {x, y} boundaries from element nativeEvent
  const getBoundaries = useCallback((e) => Platform.select({
    native: { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY },
    default: { x: e.nativeEvent.layerX, y: e.nativeEvent.layerY },
  }), []);

  // press event
  const handlePress = useCallback((e, type) => {
    if (!touchable) { return; }

    const { x, y } = getBoundaries(e);

    // on touch up
    if (type === 'up') { handleTouchUp({ x, y }); }
    // on touch down
    if (type === 'down') { handleTouchDown({ x, y }); }
  },
  [touchable, getBoundaries, handleTouchUp, handleTouchDown]);

  // drag event
  const handleDrag = useCallback((e) => {
    if (!press || !touchable) { return; }

    const { x, y } = getBoundaries(e);

    setPosition((prev) => (Platform.select({
      default: {
        x: prev.x - x * (e.movementX / 150),
        y: prev.y - y * (e.movementY / 150),
      },
      native: {
        x: prev.x + ((originPosition.x - x) / 10),
        y: prev.y + ((originPosition.y - y) / 10),
      },
    })));
  },
  [getBoundaries, originPosition.x, originPosition.y, press, touchable]);

  return { handleDrag, handlePress, showPolygon, position, zoom };
}
