import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform, View } from 'react-native';
import { Circle, ClipPath, Defs, Ellipse, G, Image, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import noop from 'lodash.noop';
import useImageDamage from '../../hooks/useDamageImage';

const IMAGE_OPACITY = '0.35';
const RADIUS_INIT = 15;

function Wrapper({
  children,
  name,
}) {
  if (Platform.OS === 'ios') {
    return <G clipPath={name && `url(#clip${name})`}>{children}</G>;
  }

  return children;
}

Wrapper.propTypes = {
  name: PropTypes.string.isRequired,
};

function DamageImage({
  clip,
  name,
  source,
  opacity,
}) {
  const href = useMemo(
    () => (Platform.OS === 'web' ? source.uri : source),
    [source],
  );

  const clipPath = useMemo(
    () => (Platform.OS !== 'ios' ? clip && `url(#clip${name})` : undefined),
    [clip, name],
  );

  return (
    <Wrapper name={name}>
      <Image
        key={name}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        opacity={opacity}
        href={href}
        clipPath={clipPath}
      />
    </Wrapper>
  );
}

DamageImage.propTypes = {
  clip: PropTypes.bool,
  name: PropTypes.string,
  opacity: PropTypes.string,
  source: PropTypes.shape({ uri: PropTypes.string }),
};

DamageImage.defaultProps = {
  clip: false,
  name: '',
  opacity: '1',
  source: { uri: '' },
};

function DamageHighlight({
  image,
  polygons,
  ellipse,
  isValidated,
  onAdd,
  onValidate,
}) {
  const {
    state,
    setter,
    getSvgRatio,
    saveEllipse,
  } = useImageDamage(image);
  const [RATIO_X, RATIO_Y] = getSvgRatio;

  const updatedWidth = useMemo(() => {
    if (ellipse) {
      const newWidth = (state.location ? state.location.cx - ellipse.cx : 0) + state.ellipseW;
      const originalWidth = (state.location ? state.location.cx : ellipse.cx) + ellipse.rx;

      return state.ellipseW ? newWidth : originalWidth;
    }
    setter.setLocation(null);
    setter.setEllipseW(null);

    return 0;
  }, [ellipse, setter, state.location, state.ellipseW]);

  const updatedHeight = useMemo(() => {
    if (ellipse) {
      const newHeight = (state.location ? state.location.cy - ellipse.cy : 0) + state.ellipseH;
      const originalHeight = (state.location ? state.location.cy : ellipse.cy) - ellipse.ry;

      return state.ellipseH ? newHeight : originalHeight;
    }
    setter.setLocation(null);
    setter.setEllipseH(null);

    return 0;
  }, [ellipse, setter, state.location, state.ellipseH]);

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

  const polygon = useMemo(() => {
    const {
      location,
      ellipseW,
      ellipseH,
    } = state;
    return (
      <>
        {
          ellipse && (
            <Ellipse
              cx={location ? location.cx : ellipse.cx}
              cy={location ? location.cy : ellipse.cy}
              rx={ellipseW ? Math.abs(ellipseW - ellipse.cx) : ellipse.rx}
              ry={ellipseH ? Math.abs(ellipseH - ellipse.cy) : ellipse.ry}
              stroke="yellow"
              fillOpacity={0} // On the web, by default it is fill in black
              strokeWidth={2.5}
            />
          )
        }
        {
          polygons.map((p, index) => (
            <Polygon
              key={`${image.id}-polygon-${String(index)}`}
              points={p.map((card) => `${(card[0])},${(card[1])}`)
                .join(' ')}
              stroke="yellow"
              fillOpacity={0} // On the web, by default it is fill in black
              strokeWidth={2.5}
            />
          ))
        }
      </>
    );
  }, [state, ellipse, polygons, image.id]);

  useEffect(() => {
    if (isValidated) {
      handleValidate();
    }
  }, [handleValidate, isValidated]);

  if (!image) {
    return <View />;
  }

  if (isEmpty(polygons) && !ellipse) {
    return (
      <Svg
        width={state.width}
        height={state.height}
        viewBox={`0 0 ${image.width} ${image.height}`}
        onPress={onAdd}
        onClick={onAdd}
      >
        <DamageImage name={image.id} source={image.source} />
      </Svg>
    );
  }

  return (
    <View>
      <Svg
        width={state.width}
        height={state.height}
        viewBox={`0 0 ${image.width} ${image.height}`}
        onPress={onAdd}
        onMouseMove={handleDrag}
        onTouchMove={handleDrag}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <Defs>
          <ClipPath>{polygon}</ClipPath>
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
                cx={state.location ? state.location.cx : ellipse.cx}
                fill="mediumseagreen"
                onMouseDown={() => setter.setDragY(true)}
                onPressIn={() => setter.setDragY(true)}
              />
              <Circle
                r={RADIUS_INIT}
                cx={updatedWidth}
                cy={state.location ? state.location.cy : ellipse.cy}
                fill="red"
                onMouseDown={() => setter.setDragX(true)}
                onPressIn={() => setter.setDragX(true)}
              />
              <Circle
                r={RADIUS_INIT}
                cy={state.location ? state.location.cy : ellipse.cy}
                cx={state.location ? state.location.cx : ellipse.cx}
                fill="orange"
                onMouseDown={() => setter.setDragLocation(true)}
                onPressIn={() => setter.setDragLocation(true)}
              />
            </>
          )
        }
      </Svg>
    </View>
  );
}

export default DamageHighlight;

DamageHighlight.propTypes = {
  ellipse: PropTypes.shape({
    cx: PropTypes.number,
    cy: PropTypes.number,
    rx: PropTypes.number,
    ry: PropTypes.number,
  }),
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
  isValidated: PropTypes.bool,
  onAdd: PropTypes.func,
  onValidate: PropTypes.func,
  polygons: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number),
    ),
  ), // [[[0, 0], [1, 0], [0, 1]], [[2, 0], [1, 1], [0, 2]]]
};

DamageHighlight.defaultProps = {
  image: null,
  ellipse: null,
  isValidated: false,
  onAdd: noop,
  onValidate: noop,
  polygons: [],
};
