import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import log from '../../utils/log';

import { useXMLParser } from './hooks';
import SVGElementMapper from './SVGElementMapper';

export default function Overlay({ label, svg, rootStyles, pathStyles }) {
  const doc = useXMLParser(svg);
  const svgElement = useMemo(() => {
    const svgElm = doc.children[0];
    if (svgElm.tagName !== 'svg') {
      throw new Error('Invalid Overlay SVG: expected <svg> tag as the first children of XML document.');
    }
    return svgElm;
  }, [doc]);

  useEffect(() => {
    log(['[Event] Loading sight', label]);
  }, [label]);

  return (
    <SVGElementMapper
      element={svgElement}
      rootStyles={rootStyles}
      pathStyles={pathStyles}
    />
  );
}

Overlay.propTypes = {
  label: PropTypes.string,
  pathStyles: PropTypes.object,
  rootStyles: PropTypes.object,
  svg: PropTypes.string.isRequired,
};

Overlay.defaultProps = {
  label: '',
  pathStyles: {},
  rootStyles: {},
};
