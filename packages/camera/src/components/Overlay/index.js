import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useXMLParser } from './hooks';
import SVGElementMapper from './SVGElementMapper';
import log from '../../utils/log';

export default function Overlay({ label, svg, ...passThoughProps }) {
  const doc = useXMLParser(svg);
  const svgElement = useMemo(() => {
    const svgElm = doc.children[0];
    if (svgElm.tagName !== 'svg') {
      throw new Error('Invalid Part View 360 SVG: expected <svg> tag as the first children of XML document.');
    }
    return svgElm;
  }, [doc]);

  useEffect(() => {
    log(['[Event] Loading sight', label]);
  }, [label]);

  console.log('passThoughProps =', passThoughProps);

  return (
    <SVGElementMapper
      element={svgElement}
      getAttributes={{}}
    />
  );
}

Overlay.propTypes = {
  label: PropTypes.string,
  svg: PropTypes.string.isRequired,
};

Overlay.defaultProps = {
  label: '',
};
