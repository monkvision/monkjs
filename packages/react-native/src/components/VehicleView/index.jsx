/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import Svg, { G, Path, Ellipse, Defs } from 'react-native-svg';

import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import camelCase from 'lodash.camelcase';
import isPropValid from '@emotion/is-prop-valid';
import xml2js from 'react-native-xml2js';

function SVGComponent({ elementTag, getFillColor, onPress, parsedSVG }) {
  const Component = { svg: Svg, g: G, path: Path, ellipse: Ellipse, defs: Defs }[elementTag];
  const { $: nodeProps = {}, ...children } = parsedSVG;

  const { id, fill, ...props } = useMemo(() => {
    const newProps = {};

    Object.entries(nodeProps).forEach(([key, value]) => {
      if (isPropValid(key)) {
        newProps[key] = value;
      } else if (isPropValid(camelCase(key))) {
        newProps[camelCase(key)] = value;
      }
    });

    const onClickPress = () => onPress(id, elementTag);

    return {
      ...newProps,
      ...Platform.select({
        default: { onClick: onClickPress },
        native: { onPress: onClickPress },
      }),
    };
  }, [elementTag, nodeProps, onPress]);

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...props}
      id={id}
      onClick={() => onPress(id, elementTag)}
      fill={getFillColor(id, fill)}
    >
      {!isEmpty(children) ? (
        Object.entries(children).map(([childTag, parsedChildSVGArray]) => (
          parsedChildSVGArray.map((parsedChildSVG, childIndex) => (
            <SVGComponent
              key={`${childTag}-${childIndex}`}
              elementTag={childTag}
              getFillColor={getFillColor}
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
};

/**
 * @param xml {string}
 * @returns {JSX.Element}
 * @constructor
 */
export default function VehicleView({ xml }) {
  const [parsedSvg, setParsedSvg] = useState();
  const [activeParts, setActiveParts] = useState({});

  const handlePress = useCallback((id) => {
    if (id !== undefined) {
      const activePart = activeParts[id];

      setActiveParts((prev) => ({
        ...prev,
        [id]: isBoolean(activePart) ? !activePart : true,
      }));
    }
  }, [activeParts]);

  const getFillColor = useCallback((id, defaultColor) => {
    const activePart = activeParts[id];
    return activePart ? '#fa603d' : defaultColor;
  }, [activeParts]);

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
    />
  );
}

VehicleView.propTypes = {
  xml: PropTypes.string.isRequired,
};
