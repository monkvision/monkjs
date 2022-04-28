import React from 'react';
import PropTypes from 'prop-types';
import useViewMeta from 'hooks/useViewMeta';
import ScrollToTop from 'components/ScrollToTop';

/**
 * Layout component with behaviors enhancing user experience
 * @param children {JSX.node}
 * @param description {string}
 * @param title {string}
 * @param viewName {string}
 * @param passthroughprops {object}
 * @returns {JSX.Element}
 * @constructor
 */
export default function View({
  children,
  description,
  title,
  viewName,
  ...passthroughprops
}) {
  useViewMeta(viewName, description, title);

  return (
    <div {...passthroughprops}>
      <ScrollToTop />
      {children}
    </div>
  );
}

View.propTypes = {
  description: PropTypes.string,
  passthroughprops: PropTypes.object,
  title: PropTypes.string,
  viewName: PropTypes.string.isRequired,
};

View.defaultProps = {
  description: '',
  passthroughprops: {},
  title: '',
};
