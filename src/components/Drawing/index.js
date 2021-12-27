import React from 'react';

// eslint-disable-next-line react/prop-types
export default ({ alt, xml, ...props }) => <img src={xml} alt={alt} {...props} />;
