import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';
import { Circle, ClipPath, Defs, Ellipse, Svg } from 'react-native-svg';
import useImageDamage from '../../hooks/useDamageImage';
import DamageImage from '../DamageImage';

const RADIUS_INIT = 15;
const IMAGE_OPACITY = '0.35';

export default function DamageAnnotations({
  image,
  onAdd,
  onRemove,
  onValidate,
}) {
  const [isPointAdded, setIsPointAdded] = useState(false);
  const [ellipse, setEllipse] = useState(null);
  const {
    state,
    setter,
    getSvgRatio,
    saveEllipse,
  } = useImageDamage(image);

  const [RATIO_X, RATIO_Y] = getSvgRatio;

  const updatedWidth = useMemo(() => {
    if (ellipse) {
      const newWidth = (state.location?.cx ? state.location.cx - ellipse.cx : 0) + state.ellipseW;
      const originalWidth = (state.location?.cx ? state.location.cx : ellipse.cx) + ellipse.rx;

      return state.ellipseW ? newWidth : originalWidth;
    }
    setter.setLocation(null);
    setter.setEllipseW(null);

    return 0;
    // eslint-disable-next-line
  }, [ellipse, state.ellipseW, state.location]);

  const updatedHeight = useMemo(() => {
    if (ellipse) {
      const newHeight = (state.location?.cy ? state.location.cy - ellipse.cy : 0) + state.ellipseH;
      const originalHeight = (state.location?.cy ? state.location.cy : ellipse.cy) - ellipse.ry;

      return state.ellipseH ? newHeight : originalHeight;
    }
    setter.setLocation(null);
    setter.setEllipseH(null);

    return 0;
    // eslint-disable-next-line
  }, [ellipse, state.ellipseH, state.location]);

  const handleAddPoint = useCallback((event) => {
    if (!isPointAdded) {
      const prefixKey = Platform.select({
        native: 'location',
        default: 'layer',
      });
      const cx = event.nativeEvent[`${prefixKey}X`] * RATIO_X;
      const cy = event.nativeEvent[`${prefixKey}Y`] * RATIO_Y;
      setIsPointAdded(true);
      setEllipse({
        cx,
        cy,
        rx: 100,
        ry: 100,
      });
    }
    onAdd();
  }, [RATIO_X, RATIO_Y, isPointAdded, onAdd]);

  const handleMouseUp = useCallback(() => {
    setter.setDragX(false);
    setter.setDragY(false);
    setter.setDragLocation(false);
  }, [setter]);

  const handleDrag = useCallback((e) => {
    const {
      x,
      y,
    } = Platform.select({
      native: {
        x: e.nativeEvent.locationX,
        y: e.nativeEvent.locationY,
      },
      default: {
        x: e.nativeEvent.layerX,
        y: e.nativeEvent.layerY,
      },
    });

    if (state.dragX) {
      setter.setEllipseW(x * RATIO_X);
    }
    if (state.dragY) {
      setter.setEllipseH(y * RATIO_Y);
    }

    if (state.dragLocation) {
      setter.setLocation({
        cx: x * RATIO_X,
        cy: y * RATIO_Y,
      });
    }
  }, [state.dragX, state.dragY, state.dragLocation, setter, RATIO_X, RATIO_Y]);

  const handleValidate = useCallback(() => {
    if (state.location && updatedWidth !== 0 && updatedHeight !== 0) {
      const newEllipse = saveEllipse(updatedWidth, updatedHeight);
      onValidate(newEllipse);
    }
  }, [state.location, updatedWidth, updatedHeight, saveEllipse, onValidate]);

  const handleRemove = useCallback(() => {
    onRemove(ellipse);
    setEllipse(null);
  }, [ellipse, onRemove]);

  useEffect(() => {
    if (!ellipse) {
      setIsPointAdded(false);
    } else {
      onAdd(ellipse);
    }
  }, [ellipse, onAdd]);

  const polygon = useMemo(() => {
    const {
      location,
      ellipseW,
      ellipseH,
    } = state;
    return ellipse && (
      <Ellipse
        cx={location?.cx ? location.cx : ellipse.cx}
        cy={location?.cy ? location.cy : ellipse.cy}
        rx={ellipseW ? Math.abs(ellipseW - ellipse.cx) : ellipse.rx}
        ry={ellipseH ? Math.abs(ellipseH - ellipse.cy) : ellipse.ry}
        stroke="yellow"
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={2.5}
      />
    );
  }, [state, ellipse]);

  if (!image) {
    return <View />;
  }

  if (!ellipse) {
    return (
      <Card>
        <Card.Content>
          <Svg
            width={state.width}
            height={state.height}
            viewBox={`0 0 ${image.width} ${image.height}`}
            onPress={handleAddPoint}
            onClick={handleAddPoint}
          >
            <DamageImage name={image.id} source={image.source} />
          </Svg>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleRemove}>Remove</Button>
          <Button onPress={handleValidate} mode="contained">
            Finish
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Content>
        <Svg
          width={state.width}
          height={state.height}
          viewBox={`0 0 ${image.width} ${image.height}`}
          onPress={handleAddPoint}
          onMouseMove={handleDrag}
          onTouchMove={handleDrag}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          <Defs>
            <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
          </Defs>
          {/* Show background image with a low opacity */}
          <DamageImage name={image.id} source={image.source} opacity={IMAGE_OPACITY} />
          {/* Show Damages Polygon */}
          <DamageImage name={image.id} source={image.source} clip />
          {polygon}
          {
            ellipse && (
              <>
                <Circle
                  r={RADIUS_INIT}
                  cy={updatedHeight}
                  cx={state.location ? state.location?.cx : ellipse.cx}
                  fill="mediumseagreen"
                  onMouseDown={() => setter.setDragY(true)}
                  onPressIn={() => setter.setDragY(true)}
                />
                <Circle
                  r={RADIUS_INIT}
                  cx={updatedWidth}
                  cy={state.location ? state.location?.cy : ellipse.cy}
                  fill="red"
                  onMouseDown={() => setter.setDragX(true)}
                  onPressIn={() => setter.setDragX(true)}
                />
                <Circle
                  r={RADIUS_INIT}
                  cy={state.location ? state.location?.cy : ellipse.cy}
                  cx={state.location ? state.location?.cx : ellipse.cx}
                  fill="orange"
                  onMouseDown={() => setter.setDragLocation(true)}
                  onPressIn={() => setter.setDragLocation(true)}
                />
              </>
            )
          }
        </Svg>
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleRemove}>Remove</Button>
        <Button
          onPress={handleValidate}
          mode="contained"
        >
          Finish
        </Button>
      </Card.Actions>
    </Card>
  );
}

DamageAnnotations.propTypes = {
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onValidate: PropTypes.func,
};

DamageAnnotations.defaultProps = {
  image: null,
  onAdd: noop,
  onRemove: noop,
  onValidate: noop,
};
