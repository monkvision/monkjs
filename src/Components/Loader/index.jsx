import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'Components/Logo';

/**
 * Display a loader built with the Monk Logo
 * @param isLoading
 * @param logoProps {object} passed through <Logo />
 * @returns {JSX.Element}
 * @constructor
 */
function Loader({ isLoading, ...logoProps }) {
  return <Logo animated={isLoading} {...logoProps} />;
}

Loader.propTypes = {
  isLoading: PropTypes.bool,
};

Loader.defaultProps = {
  isLoading: false,
};

export default Loader;
