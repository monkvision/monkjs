import { Severity } from '../resources';
import IconSeverityLow from './IconSeverityLow';
import IconSeverityMedium from './IconSeverityMedium';
import IconSeverityHigh from './IconSeverityHigh';

const SeveritiesWithIcon = [
  { key: Severity.LOW, Icon: IconSeverityLow },
  { key: Severity.MEDIUM, Icon: IconSeverityMedium },
  { key: Severity.HIGH, Icon: IconSeverityHigh },
];

export default SeveritiesWithIcon;
