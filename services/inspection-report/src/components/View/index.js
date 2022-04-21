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
 * @param style {CSSProperties}
 * @param className {string}
 * @returns {JSX.Element}
 * @constructor
 */
export default function View({
  children,
  description,
  title,
  viewName,
  style,
  className,
}) {
  useViewMeta(viewName, description, title);

  return (
    <div style={style} className={className}>
      <ScrollToTop />
      {children}
    </div>
  );
}

View.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  title: PropTypes.string,
  viewName: PropTypes.string.isRequired,
};

View.defaultProps = {
  description: '',
  title: '',
  style: {},
  className: undefined,
};
