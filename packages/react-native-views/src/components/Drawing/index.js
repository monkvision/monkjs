import React from 'react';

// eslint-disable-next-line react/prop-types
export default ({ alt, xml, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeURIComponent(xml)}`}
    alt={alt}
    {...props}
  />
);
