/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { CommonPropTypes } from '../../../resources';

import { useCustomSVGAttributes, useInnerHTML, useJSXSpecialAttributes } from '../hooks';

export default function SVGElementMapper({
  element,
  damages,
  groupId,
  getPartAttributes,
  onPressPart,
  onPressPill,
}) {
  const Tag = useMemo(() => element.tagName, [element]);
  const attributes = useJSXSpecialAttributes(element);
  const customAttributes = useCustomSVGAttributes({
    element,
    groupId,
    damages,
    getPartAttributes,
    onPressPart,
    onPressPill,
  });
  const innerHTML = useInnerHTML({ element, damages, groupId });
  const children = useMemo(() => [...element.children], [element]);
  const passThroughGroupId = useMemo(
    () => (element.tagName === 'g' ? element.getAttribute('id') : null),
    [element],
  );

  return (
    <Tag {...attributes} {...customAttributes}>
      {innerHTML}
      {children.map((child, id) => (
        <SVGElementMapper
          key={id.toString()}
          element={child}
          groupId={passThroughGroupId ?? groupId}
          damages={damages}
          getPartAttributes={getPartAttributes}
          onPressPart={onPressPart}
          onPressPill={onPressPill}
        />
      ))}
    </Tag>
  );
}

SVGElementMapper.propTypes = {
  damages: PropTypes.arrayOf(CommonPropTypes.damage),
  element: PropTypes.any.isRequired,
  getPartAttributes: PropTypes.func,
  groupId: PropTypes.string,
  onPressPart: PropTypes.func,
  onPressPill: PropTypes.func,
};

SVGElementMapper.defaultProps = {
  damages: [],
  getPartAttributes: () => {},
  groupId: null,
  onPressPart: () => {},
  onPressPill: () => {},
};
