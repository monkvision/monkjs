import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { useCustomSVGAttributes, useInnerHTML, useJSXTransformAttributes } from './hooks';

export default function SVGElementMapper({
  element,
  rootStyles,
  pathStyles,
}) {
  const Tag = useMemo(() => element.tagName, [element]);
  const innerHTML = useInnerHTML({ element });
  const transformedAttributes = useJSXTransformAttributes(element);
  const customAttributes = useCustomSVGAttributes({
    element,
    rootStyles,
    pathStyles,
  });
  const attributes = useMemo(() => ({
    ...transformedAttributes,
    ...customAttributes,
    style: {
      ...transformedAttributes?.style ?? {},
      ...customAttributes?.style ?? {},
    },
  }), [transformedAttributes, customAttributes]);
  const children = useMemo(() => [...element.children], [element]);

  return (
    <Tag {...attributes}>
      {innerHTML}
      {children.map((child) => (
        <SVGElementMapper
          key={child.outerHTML}
          element={child}
          rootStyles={rootStyles}
          pathStyles={pathStyles}
        />
      ))}
    </Tag>
  );
}

SVGElementMapper.propTypes = {
  element: PropTypes.any.isRequired,
  pathStyles: PropTypes.object,
  rootStyles: PropTypes.object,
};

SVGElementMapper.defaultProps = {
  pathStyles: {},
  rootStyles: {},
};
