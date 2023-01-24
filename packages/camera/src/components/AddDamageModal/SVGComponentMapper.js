/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import useCustomSVGAttributes from './hooks/useCustomSVGAttributes';

const jsxSpecialAttributes = {
  class: 'className',
};

export default function SVGComponentMapper({ element, togglePart, isPartSelected }) {
  const Tag = useMemo(() => element.tagName, [element]);
  const attributes = useMemo(() => element
    .getAttributeNames()
    .reduce((prev, attr) => ({
      ...prev,
      [jsxSpecialAttributes[attr] ?? attr]: element.getAttribute(attr),
    }), {}), [element]);
  const customAttributes = useCustomSVGAttributes({ element, togglePart, isPartSelected });
  const innerHTML = useMemo(
    () => (element.tagName === 'style' && !!element.innerHTML ? element.innerHTML : null),
    [element],
  );
  const children = useMemo(() => [...element.children], [element]);

  return (
    <Tag {...attributes} {...customAttributes}>
      {innerHTML}
      {children.map((child, id) => (
        <SVGComponentMapper
          key={id.toString()}
          element={child}
          togglePart={togglePart}
          isPartSelected={isPartSelected}
        />
      ))}
      <path style={{ fill: '#ffffff' }} />
    </Tag>
  );
}

SVGComponentMapper.propTypes = {
  element: PropTypes.any.isRequired,
  isPartSelected: PropTypes.func.isRequired,
  togglePart: PropTypes.func.isRequired,
};

SVGComponentMapper.defaultProps = {};
