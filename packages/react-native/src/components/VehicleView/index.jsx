/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import Svg, { G, Path, Ellipse, Defs } from 'react-native-svg';
import PropTypes from 'prop-types';

import isBoolean from 'lodash.isboolean';
import isEmpty from 'lodash.isempty';
import xml2js from 'react-native-xml2js';

/**
 * @param xmlPath {string}
 * @returns {JSX.Element}
 * @constructor
 */
export default function VehicleView({ xmlPath }) {
  // const [error, setError] = useState();
  // const [isLoading, setLoading] = useState();

  const [xml, setXml] = useState(null);

  const handleLoad = useCallback((event) => {
    xml2js.parseString(event.target.response, (err, result) => {
      setXml(result);
    });
  }, []);

  useEffect(() => {
    const oReq = new XMLHttpRequest();
    oReq.onload = handleLoad;
    oReq.open('get', xmlPath, true);
    oReq.send();
  }, [handleLoad, xmlPath]);

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

  return !isEmpty(xml) && (
    <SVGComponent
      elementTag="svg"
      parsedSVG={xml.svg}
      onPress={handlePress}
      fill={getFillColor}
    />
  );
}

function SVGComponent({ elementTag, fill, onPress, parsedSVG }) {
  const Component = { svg: Svg, g: G, path: Path, ellipse: Ellipse, defs: Defs }[elementTag];
  const { $: nodeProps = {}, ...children } = parsedSVG;

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...nodeProps}
      onClick={() => onPress(nodeProps.id, elementTag)}
      onPress={() => onPress(nodeProps.id, elementTag)}
      fill={fill(nodeProps.id, nodeProps.fill)}
    >
      {!isEmpty(children) ? (
        Object.entries(children).map(([childTag, parsedChildSVGArray]) => (
          parsedChildSVGArray.map((parsedChildSVG, childIndex) => (
            <SVGComponent
              key={`${childTag}-${childIndex}`}
              elementTag={childTag}
              parsedSVG={parsedChildSVG}
              onClick={onPress}
              onPress={onPress}
              fill={fill}
            />
          ))
        ))
      ) : null}
    </Component>
  );
}

SVGComponent.propTypes = {
  elementTag: PropTypes.string.isRequired,
  fill: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  parsedSVG: PropTypes.shape({
    $: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

VehicleView.propTypes = {
  xmlPath: PropTypes.string.isRequired,
};
