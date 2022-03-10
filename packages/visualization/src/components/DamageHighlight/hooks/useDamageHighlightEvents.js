import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import ImageColors from 'react-native-image-colors';

const DELAY_TAP = 300;

export default function useDamageHighlightEvents({
  image,
  ratioX,
  ratioY,
}) {
  const [color, setColor] = useState('#ffff00');
  const [press, setPress] = useState(false);
  const [showPolygon, setShowPolygon] = useState(true);
  const [lastPress, setLastPress] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [originPosition, setOriginPosition] = useState({
    x: 0,
    y: 0,
  });

  // on touch releases
  const handleTouchUp = useCallback(({
    x,
    y,
  }) => {
    setPress(false);
    setShowPolygon(true);
    const now = Date.now();

    if (lastPress && now - lastPress < DELAY_TAP) {
      setZoom((prevState) => (prevState === 1 ? 0.35 : 1));
      if (zoom === 1) {
        setPosition({
          x: (x - 100) * ratioX,
          y: (y - 100) * ratioY,
        });
      } else {
        setPosition({
          x: 0,
          y: 0,
        });
      }
    } else {
      setLastPress(now);
    }
  }, [lastPress, ratioX, ratioY, zoom]);

  // on touch start
  const handleTouchDown = useCallback(({
    x,
    y,
  }) => {
    setPress(true);
    setShowPolygon(false);
    setOriginPosition({
      x,
      y,
    });
  }, []);

  // get {x, y} boundaries from element nativeEvent
  const getBoundaries = useCallback((e) => Platform.select({
    native: {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    },
    default: {
      x: e.nativeEvent.layerX,
      y: e.nativeEvent.layerY,
    },
  }), []);

  // press event
  const handlePress = useCallback((e, type) => {
    e.preventDefault();

    const {
      x,
      y,
    } = getBoundaries(e);

    // on touch up
    if (type === 'up') {
      handleTouchUp({
        x,
        y,
      });
    }
    // on touch down
    if (type === 'down') {
      handleTouchDown({
        x,
        y,
      });
    }
  },
  [getBoundaries, handleTouchUp, handleTouchDown]);

  // drag event
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    if (!press) {
      return;
    }

    const {
      x,
      y,
    } = getBoundaries(e);

    setPosition((prev) => (Platform.select({
      default: {
        x: prev.x - x * (e.movementX / 250),
        y: prev.y - y * (e.movementY / 250),
      },
      native: {
        x: prev.x + ((originPosition.x - x) / 10),
        y: prev.y + ((originPosition.y - y) / 10),
      },
    })));
  },
  [getBoundaries, originPosition.x, originPosition.y, press]);

  const getColor = useCallback(() => {
    ImageColors.getColors(image.source.uri, {
      key: 'unique_key',
      quality: 'low',
      pixelSpacing: 5,
      cache: true,
    })
      .then((res) => {
        const c = res.lightVibrant;
        const baseColor = `0x${c.split('#')[1]}`;
        const complementaryColor = (0xffffff - baseColor).toString(16);
        setColor(`#${Array(6 - complementaryColor.length)
          .fill(0)
          .join('')}${complementaryColor.toString(16)}`);
        // setColor(c);
      })
      .catch((err) => console.log(err));
  }, [image]);

  const measureText = useCallback((str, fontSize) => {
    // eslint-disable-next-line max-len
    const widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625];
    const avg = 0.5279276315789471;
    return str
      .split('')
      .map((c) => (c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg))
      .reduce((cur, acc) => acc + cur) * fontSize;
  }, []);

  return {
    handleDrag,
    handlePress,
    showPolygon,
    position,
    zoom,
    color,
    getColor,
    measureText,
  };
}
