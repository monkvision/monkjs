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
 * @returns {JSX.Element}
 * @constructor
 */
export default function View({ children, description, title, viewName }) {
  useViewMeta(viewName, description, title);

  return (
    <section>
      <ScrollToTop />
      {children}
    </section>
  );
}

View.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  viewName: PropTypes.string.isRequired,
};

View.defaultProps = {
  description: '',
  title: '',
};
