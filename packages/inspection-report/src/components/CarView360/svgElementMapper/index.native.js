/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, G, Circle, Text } from 'react-native-svg';

import { CommonPropTypes } from '../../../resources';
import CAR_PARTS from '../../../resources/carParts';
import { useCustomSVGAttributes, useInnerHTML } from '../hooks';
import { getPillDamage } from '../hooks/common';

const jsxSpecialAttributes = {
  class: 'className',
};

export default function SVGElementMapper({
  element,
  damages,
  groupId,
  getPartAttributes,
  onPressPart,
  onPressPill,
}) {
  function getAttribute(attributeElement, name) {
    for (let i = 0; i < attributeElement.attributes.length; i += 1) {
      if (attributeElement.attributes[i].name === name) {
        return attributeElement.attributes[i].nodeValue;
      }
    }
    return undefined;
  }
  const names = [];
  for (let i = 0; i < element.attributes.length; i += 1) {
    names.push(element.attributes[i].name);
  }

  const attributes = useMemo(() => names.reduce((prev, attr) => ({
    ...prev,
    [jsxSpecialAttributes[attr] ?? attr]: getAttribute(element, attr),
  }), {}), [element]);

  const elementClass = getAttribute(element, 'class');
  const elementId = getAttribute(element, 'id');
  let partKey = null;
  if (groupId && CAR_PARTS.includes(groupId)) {
    partKey = groupId;
  }
  if (elementClass && elementClass.includes('selectable') && CAR_PARTS.includes(elementId)) {
    partKey = elementId;
  }

  const customAttributes = useCustomSVGAttributes({
    element,
    groupId,
    damages,
    getPartAttributes,
    onPressPart,
    onPressPill,
  });
  const innerHTML = useInnerHTML({ element, damages, groupId });
  const { part } = getPillDamage({ damages, pillId: groupId });
  const isPill = elementClass?.includes('damage-pill');

  const onPress = () => {
    if (isPill) {
      onPressPill(part);
    } else {
      onPressPart(partKey);
    }
  };
  const elementChildren = [];
  if (element.childNodes) {
    for (let i = 0; i < element.childNodes.length; i += 1) {
      elementChildren.push(element.childNodes[i]);
    }
  }
  const children = useMemo(() => [...elementChildren], [element]);
  const passThroughGroupId = useMemo(
    () => {
      if (element.tagName === 'g') {
        return elementId;
      }
      return null;
    },
    [element],
  );

  if (element.tagName === 'svg') {
    return (
      <Svg {...attributes}>
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
        <Path style={{ fill: '#ffffff' }} />
      </Svg>
    );
  } if (element.tagName === 'path') {
    return (
      <Path {...attributes} {...customAttributes} onPress={partKey || isPill ? onPress : null}>
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
        <Path style={{ fill: '#ffffff' }} />
      </Path>
    );
  } if (element.tagName === 'g') {
    return (
      <G {...attributes} {...customAttributes} onPress={partKey || isPill ? onPress : null}>
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
        <Path style={{ fill: '#ffffff' }} />
      </G>
    );
  } if (element.tagName === 'circle') {
    return (
      <Circle {...attributes} {...customAttributes} />
    );
  } if (element.tagName === 'text') {
    return (
      <Text {...attributes} {...customAttributes}>
        {innerHTML}
      </Text>
    );
  }
  return null;
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
