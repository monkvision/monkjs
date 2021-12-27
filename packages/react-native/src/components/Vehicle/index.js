/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import Svg, { G, Path, Ellipse, Defs } from 'react-native-svg';

import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import noop from 'lodash.noop';
import camelCase from 'lodash.camelcase';

import isPropValid from '@emotion/is-prop-valid';
import xml2js from 'react-native-xml2js';
import tinycolor from 'tinycolor2';

function SVGComponent({
  elementTag, getFillColor, selectedId, onPress, parsedSVG, ...passThroughProps
}) {
  const Component = { svg: Svg, g: G, path: Path, ellipse: Ellipse, defs: Defs }[elementTag];
  const { $: nodeProps = {}, ...children } = parsedSVG;

  const { id, fill, stroke, ...props } = useMemo(() => {
    const newProps = {};

    Object.entries(nodeProps).forEach(([key, value]) => {
      if (isPropValid(key)) {
        newProps[key] = value;
      } else if (isPropValid(camelCase(key))) {
        newProps[camelCase(key)] = value;
      }
    });

    const onClickPress = () => onPress(newProps.id, elementTag);

    return {
      ...newProps,
      ...passThroughProps,
      ...Platform.select({
        default: { onClick: onClickPress },
        native: { onPress: onClickPress },
      }),
    };
  }, [elementTag, nodeProps, onPress, passThroughProps]);

  const getStroke = useCallback((_id, defaultColor) => ((_id === selectedId && selectedId !== undefined) ? tinycolor('#274b9f').toHexString()
    : defaultColor), [selectedId]);

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...props}
      id={id}
      onClick={() => onPress(id, elementTag)}
      fill={getFillColor(id, fill)}
      stroke={getStroke(id, stroke)}
    >
      {!isEmpty(children) ? (
        Object.entries(children).map(([childTag, parsedChildSVGArray]) => (
          parsedChildSVGArray.map((parsedChildSVG, childIndex) => (
            <SVGComponent
              key={`${childTag}-${childIndex}`}
              elementTag={childTag}
              getFillColor={getFillColor}
              selectedId={selectedId}
              parsedSVG={parsedChildSVG}
              onClick={onPress}
              onPress={onPress}
            />
          ))
        ))
      ) : null}
    </Component>
  );
}

SVGComponent.propTypes = {
  elementTag: PropTypes.string.isRequired,
  getFillColor: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  parsedSVG: PropTypes.shape({
    $: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  selectedId: PropTypes.string,
};

SVGComponent.defaultProps = {
  selectedId: undefined,
};

/**
 * @param activeMixedColor {string}
 * @param pressAble {bool}
 * @param onPress {func}
 * @param xml {string}
 * @param initialActiveParts
 * @param activeParts
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
export default function Vehicle({
  activeMixedColor,
  onPress,
  pressAble,
  xml,
  initialActiveParts,
  activeParts,
  ...passThroughProps
}) {
  const [parsedSvg, setParsedSvg] = useState();
  const [controlledActiveParts, setActiveParts] = useState(initialActiveParts);
  const [selectedId, setSelectedId] = useState();

  const handlePress = useCallback((id) => {
    if (id !== undefined && pressAble === true) {
      const activePart = activeParts !== undefined ? activeParts[id] : controlledActiveParts[id];
      const isActive = isBoolean(activePart) ? !activePart : true;

      setActiveParts((prev) => ({ ...prev, [id]: isActive }));
      setSelectedId(id);

      onPress(id, isActive, activeParts);
    }
  }, [activeParts, controlledActiveParts, onPress, pressAble]);

  const getFillColor = useCallback((id, defaultColor) => {
    const activePart = activeParts !== undefined ? activeParts[id] : controlledActiveParts[id];

    return activePart
      ? tinycolor.mix(activeMixedColor, defaultColor).toHexString()
      : defaultColor;
  }, [activeMixedColor, activeParts, controlledActiveParts]);

  useEffect(() => {
    xml2js.parseString(xml, (e, result) => {
      setParsedSvg(result.svg);
    });
  }, [xml]);

  return !isEmpty(parsedSvg) && (
    <SVGComponent
      elementTag="svg"
      parsedSVG={parsedSvg}
      onPress={handlePress}
      getFillColor={getFillColor}
      selectedId={selectedId}
      {...passThroughProps}
    />
  );
}

Vehicle.propTypes = {
  activeMixedColor: PropTypes.string,
  activeParts: PropTypes.objectOf(PropTypes.bool),
  initialActiveParts: PropTypes.objectOf(PropTypes.bool),
  onPress: PropTypes.func,
  pressAble: PropTypes.bool,
  xml: PropTypes.string.isRequired,
};

Vehicle.defaultProps = {
  activeMixedColor: '#fa603d',
  activeParts: {},
  initialActiveParts: {},
  onPress: noop,
  pressAble: false,
};
export { default as vehiclePartsNames } from './vehiclePartsNames';
