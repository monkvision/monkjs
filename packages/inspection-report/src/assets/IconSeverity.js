import PropTypes from 'prop-types';
import * as React from 'react';
import { useMemo } from 'react';
import { Severity } from '../resources';
import IconSeverityNone from './IconSeverityNone';
import SeveritiesWithIcon from './SeveritiesWithIcon';

export default function IconSeverity({ severity, ...rest }) {
  const Icon = useMemo(
    () => SeveritiesWithIcon.find((s) => s.key === severity)?.Icon ?? IconSeverityNone,
    [],
  );

  return <Icon {...rest} />;
}

IconSeverity.propTypes = {
  severity: PropTypes.oneOf(Object.values(Severity)),
};

IconSeverity.defaultProps = {
  severity: undefined,
};
