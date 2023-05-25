/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useCustomSVGAttributes, useJSXSpecialAttributes } from './hooks';

export default function SVGElementMapper({
  element,
  getAttributes,
}) {
  const Tag = useMemo(() => element.tagName, [element]);
  const attributes = useJSXSpecialAttributes(element);
  const customAttributes = useCustomSVGAttributes({
    element,
    getAttributes,
  });
  const children = useMemo(() => [...element.children], [element]);

  return (
    <Tag {...attributes} {...customAttributes}>
      {children.map((child, id) => (
        <SVGElementMapper
          key={id.toString()}
          element={child}
          getAttributes={getAttributes}
        />
      ))}
    </Tag>
  );
}

SVGElementMapper.propTypes = {
  element: PropTypes.any.isRequired,
  getAttributes: PropTypes.func,
};

SVGElementMapper.defaultProps = {
  getAttributes: () => {},
};
