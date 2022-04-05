import React from 'react';

// eslint-disable-next-line react/prop-types
export default function Drawing ({ alt, xml, ...props }) {
  return <img src={xml} alt={alt} {...props} />;
}
