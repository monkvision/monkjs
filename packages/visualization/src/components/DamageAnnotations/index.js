import React, { useCallback, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Platform } from 'react-native';
import { Circle, ClipPath, Defs, Ellipse, Svg } from 'react-native-svg';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import monk from '@monkvision/corejs';

import DamageImage from '../DamageImage';

const DEFAULT_OPTIONS = {
  backgroundOpacity: 0.33,
  ellipse: {
    stroke: {
      color: 'white',
      strokeWidth: 2.5,
    },
    anchor: {
      x: { radius: 15 },
      y: { radius: 15 },
      o: { radius: 15 },
    },
  },
};

const DamageAnnotations = forwardRef(({
  image,
  inspectionId,
  onAdd,
  onUpdate,
  options,
  clip,
  renderOptions,
}, ref) => {
  const [isPointAdded, setIsPointAdded] = useState(false);
  const [ellipse, setEllipse] = useState(null);
  const [ellWidth, setEllWidth] = useState(null);
  const [ellHeight, setEllHeight] = useState(null);
  const [pos, setPos] = useState(null);
  const [dragX, setDragX] = useState(false);
  const [dragY, setDragY] = useState(false);
  const [dragPos, setDragPos] = useState(false);

  const RATIO_X = image.width / renderOptions.width;
  const RATIO_Y = image.height / renderOptions.height;

  /**
   * @type {number}
   */
  const updatedWidth = useMemo(() => {
    if (ellipse) {
      return ellWidth
        ? (pos ? pos.cx - ellipse.cx : 0) + ellWidth
        : (pos ? pos.cx : ellipse.cx) + ellipse.rx;
    }
    setPos(null);
    setEllWidth(null);
    return 0;
  }, [ellipse, pos, ellWidth]);

  /**
   * @type {number}
   */
  const updatedHeight = useMemo(() => {
    if (ellipse) {
      return ellHeight
        ? (pos ? pos.cy - ellipse.cy : 0) + ellHeight
        : (pos ? pos.cy : ellipse.cy) - ellipse.ry;
    }
    setPos(null);
    setEllHeight(null);
    return 0;
  }, [ellipse, pos, ellHeight]);

  const handleMouseUp = useCallback(() => {
    setDragX(false);
    setDragY(false);
    setDragPos(false);
  }, []);

  const handleDrag = useCallback((e) => {
    const x = Platform.OS === 'web' ? e.nativeEvent.layerX : e.nativeEvent.locationX;
    const y = Platform.OS === 'web' ? e.nativeEvent.layerY : e.nativeEvent.locationY;

    if (dragX) {
      setEllWidth(x * RATIO_X);
    }

    if (dragY) {
      setEllHeight(y * RATIO_Y);
    }

    if (dragPos) {
      setPos({
        cx: x * RATIO_X,
        cy: y * RATIO_Y,
      });
    }
    onUpdate(ellipse);
  }, [dragX, dragY, dragPos, onUpdate, ellipse, RATIO_X, RATIO_Y]);

  const handleAddPoint = useCallback((event) => {
    if (!isPointAdded && event?.nativeEvent) {
      const ratioX = image.width / renderOptions.width;
      const ratioY = image.height / renderOptions.height;
      let cx; let
        cy;
      if (Platform.OS === 'web') {
        cx = event.nativeEvent.layerX * ratioX;
        cy = event.nativeEvent.layerY * ratioY;
      } else {
        cx = event.nativeEvent.locationX * ratioX;
        cy = event.nativeEvent.locationY * ratioY;
      }
      const { rx, ry } = renderOptions.ellipse;
      const newEllipse = { cx, cy, rx, ry };
      setIsPointAdded(true);
      setEllipse(newEllipse);
      onAdd(ellipse);
    }
  }, [isPointAdded, image.width, image.height, renderOptions, onAdd, ellipse]);

  const handlePinchGesture = useCallback((nativeEvent) => {
    const { scale } = nativeEvent;
    if (ellipse) {
      setEllWidth(ellipse.rx / scale);
      setEllHeight(ellipse.ry / scale);
    }
  }, [ellipse]);

  useImperativeHandle(ref, () => ({
    createDamageView: async (damageType, partType) => {
      if (!pos.cx || !pos.cy || !ellHeight || !ellWidth) {
        throw new Error(`${pos.cx ? '' : 'cx'}, ${pos.cy ? '' : 'cy'}, ${ellHeight ? '' : 'ry'}, ${ellWidth ? '' : 'rx'} is/are null`);
      }

      const rx = Math.abs(ellWidth - ellipse.cx);
      const ry = Math.abs(ellHeight - ellipse.cy);

      const newDamage = await monk.entity.damage.createOne(inspectionId, { damageType, partType });
      const viewCreateProp = {
        imageId: image.id,
        damageId: newDamage.id,
        boundingBox: {
          xmin: pos.cx - rx,
          ymin: pos.cy - ry,
          width: rx * 2,
          height: ry * 2,
        },
      };

      return monk.entity.view.createOne(inspectionId, viewCreateProp);
    },
  }));

  const polygon = useMemo(() => (
    ellipse && (
      <Ellipse
        cx={pos ? pos.cx : ellipse.cx}
        cy={pos ? pos.cy : ellipse.cy}
        rx={ellWidth ? Math.abs(ellWidth - ellipse.cx) : ellipse?.rx}
        ry={ellHeight ? Math.abs(ellHeight - ellipse.cy) : ellipse.ry}
        stroke={options?.ellipse?.stroke?.color ?? DEFAULT_OPTIONS.ellipse.stroke.color}
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={options?.ellipse?.stroke?.strokeWidth
          ?? DEFAULT_OPTIONS.ellipse.stroke.strokeWidth}
        onMouseDown={() => setDragPos(true)}
        onPressIn={() => setDragPos(true)}
      />
    )
  ), [options.ellipse.stroke, pos, ellipse, ellWidth, ellHeight]);

  const anchor = useMemo(() => (
    ellipse && (
      <>
        <Circle
          r={options?.ellipse?.anchor?.y?.radius ?? DEFAULT_OPTIONS.ellipse.anchor.y.radius}
          cy={updatedHeight}
          cx={pos ? pos.cx : ellipse.cx}
          fill={options?.ellipse?.anchor?.y?.color ?? DEFAULT_OPTIONS.ellipse.stroke.color}
          onMouseDown={() => setDragY(true)}
          onPressIn={() => setDragY(true)}
        />
        <Circle
          r={options?.ellipse?.anchor?.x?.radius ?? DEFAULT_OPTIONS.ellipse.anchor.x.radius}
          cx={updatedWidth}
          cy={pos ? pos.cy : ellipse.cy}
          fill={options?.ellipse?.anchor?.x?.color ?? DEFAULT_OPTIONS.ellipse.stroke.color}
          onMouseDown={() => setDragX(true)}
          onPressIn={() => setDragX(true)}
        />
        <Circle
          r={options?.ellipse?.anchor?.o?.radius ?? DEFAULT_OPTIONS.ellipse.anchor.o.radius}
          cy={pos ? pos.cy : ellipse.cy}
          cx={pos ? pos.cx : ellipse.cx}
          fill={options?.ellipse?.anchor?.o?.color ?? DEFAULT_OPTIONS.ellipse.stroke.color}
          onMouseDown={() => setDragPos(true)}
          onPressIn={() => setDragPos(true)}
        />
      </>
    )), [ellipse, options.ellipse.anchor, pos, updatedHeight, updatedWidth]);

  if (!ellipse) {
    return (
      <Svg
        viewBox={`0 0 ${image.width} ${image.height}`}
        onPress={handleAddPoint}
        onClick={handleAddPoint}
        {...renderOptions}
      >
        <DamageImage name={image.id} source={image.source} />
      </Svg>
    );
  }

  return (
    <PinchGestureHandler onGestureEvent={(p) => handlePinchGesture(p.nativeEvent)}>
      <Svg
        viewBox={`0 0 ${image.width} ${image.height}`}
        onMouseMove={handleDrag}
        onTouchMove={handleDrag}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        {...renderOptions}
      >
        <Defs>
          <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
        </Defs>
        {/* Show background image with a low opacity */}
        <DamageImage
          name={image.id}
          source={image.source}
          opacity={options?.backgroundOpacity ?? DEFAULT_OPTIONS.backgroundOpacity}
        />
        {/* Show Damages Polygon */}
        <DamageImage name={image.id} source={image.source} clip={clip} />
        {polygon}
        {anchor}
      </Svg>
    </PinchGestureHandler>
  );
});

DamageAnnotations.propTypes = {
  clip: PropTypes.bool,
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size
  }).isRequired,
  inspectionId: PropTypes.string.isRequired,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  options: PropTypes.shape({
    backgroundOpacity: PropTypes.number,
    ellipse: {
      stroke: PropTypes.shape({
        color: PropTypes.string,
        strokeWidth: PropTypes.number,
      }),
      anchor: PropTypes.shape({
        o: PropTypes.shape({
          color: PropTypes.string,
          radius: PropTypes.number,
        }),
        x: PropTypes.shape({
          color: PropTypes.string,
          radius: PropTypes.number,
        }),
        y: PropTypes.shape({
          color: PropTypes.string,
          radius: PropTypes.number,
        }),
      }),
    },
  }),
  renderOptions: PropTypes.shape({
    ellipse: PropTypes.shape({
      rx: PropTypes.number,
      ry: PropTypes.number,
    }),
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
};

DamageAnnotations.defaultProps = {
  clip: true,
  onAdd: null,
  onUpdate: null,
  options: DEFAULT_OPTIONS,
};
