import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { G, Image, Polygon, Svg, Ellipse, Circle, Defs, ClipPath } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import noop from 'lodash.noop';

const width = Math.min(Dimensions.get('window').width - 50, 400);
const IMAGE_OPACITY = '0.35';
const RADIUS_INIT = 15;

function Wrapper({ children, name }) {
  if (Platform.OS === 'ios') {
    return <G clipPath={name && `url(#clip${name})`}>{children}</G>;
  }

  return children;
}

Wrapper.propTypes = {
  name: PropTypes.string.isRequired,
};

function DamageImage({ clip, name, source, opacity }) {
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

function DamageHighlight({ image, polygons, ellipse, isValidated, onAdd, onValidate }) {
  const [ellipseW, setEllipseW] = useState(null);
  const [ellipseH, setEllipseH] = useState(null);
  const [location, setLocation] = useState(null);
  const [dragX, setDragX] = useState(false);
  const [dragY, setDragY] = useState(false);
  const [dragLocation, setDragLocation] = useState(false);

  const height = image.height * (width / image.width);
  const RATIO_X = image.width / width;
  const RATIO_Y = image.height / height;

  const updatedWidth = useMemo(() => {
    if (ellipse) {
      const newWidth = (location ? location.cx - ellipse.cx : 0) + ellipseW;
      const originalWidth = (location ? location.cx : ellipse.cx) + ellipse.rx;

      return ellipseW ? newWidth : originalWidth;
    }
    setLocation(null);
    setEllipseW(null);

    return 0;
  }, [ellipse, location, ellipseW]);

  const updatedHeight = useMemo(() => {
    if (ellipse) {
      const newHeight = (location ? location.cy - ellipse.cy : 0) + ellipseH;
      const originalHeight = (location ? location.cy : ellipse.cy) - ellipse.ry;

      return ellipseH ? newHeight : originalHeight;
    }
    setLocation(null);
    setEllipseH(null);

    return 0;
  }, [ellipse, location, ellipseH]);

  const handleMouseUp = useCallback(() => {
    setDragX(false);
    setDragY(false);
    setDragLocation(false);
  }, []);

  const handleDrag = useCallback((e) => {
    const x = Platform.OS === 'web' ? e.nativeEvent.layerX : e.nativeEvent.locationX;
    const y = Platform.OS === 'web' ? e.nativeEvent.layerY : e.nativeEvent.locationY;

    if (dragX) {
      setEllipseW(x * RATIO_X);
    }
    if (dragY) {
      setEllipseH(y * RATIO_Y);
    }

    if (dragLocation) {
      setLocation({
        cx: x * RATIO_X,
        cy: y * RATIO_Y,
      });
    }
  }, [dragX, dragY, dragLocation, RATIO_X, RATIO_Y]);

  const handleFinish = useCallback(() => {
    if (location && updatedWidth !== 0 && updatedHeight !== 0) {
      const newEllipse = {
        cx: location.cx * (width / image.width),
        cy: location.cy * (height / image.height),
        rx: updatedWidth * (width / image.width),
        ry: updatedHeight * (height / image.height),
      };
      onValidate(newEllipse);
    }
  }, [location, image, updatedWidth, updatedHeight, onValidate]);

  const polygon = useMemo(() => (
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
              points={p.map((card) => `${(card[0])},${(card[1])}`).join(' ')}
              stroke="yellow"
              fillOpacity={0} // On the web, by default it is fill in black
              strokeWidth={2.5}
            />
          ))
        }
    </>
  ), [ellipse, location, ellipseW, ellipseH, polygons, image.id]);

  useEffect(() => {
    if (isValidated) {
      handleFinish();
    }
  }, [handleFinish, isValidated]);

  if (!image) {
    return <View />;
  }

  if (isEmpty(polygons) && !ellipse) {
    return (
      <Svg
        width={width}
        height={height}
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
        width={width}
        height={height}
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
                cx={location ? location.cx : ellipse.cx}
                fill="mediumseagreen"
                onMouseDown={() => setDragY(true)}
                onPressIn={() => setDragY(true)}
              />
              <Circle
                r={RADIUS_INIT}
                cx={updatedWidth}
                cy={location ? location.cy : ellipse.cy}
                fill="red"
                onMouseDown={() => setDragX(true)}
                onPressIn={() => setDragX(true)}
              />
              <Circle
                r={RADIUS_INIT}
                cy={location ? location.cy : ellipse.cy}
                cx={location ? location.cx : ellipse.cx}
                fill="orange"
                onMouseDown={() => setDragLocation(true)}
                onPressIn={() => setDragLocation(true)}
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
