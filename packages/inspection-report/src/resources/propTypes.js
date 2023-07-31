import PropTypes from 'prop-types';
import carParts from './carParts';
import { DamageMode, Severity, CarOrientation, VehicleType, DisplayMode, RepairOperation } from './types';

const CommonPropTypes = {
  carOrientation: PropTypes.oneOf(Object.values(CarOrientation)),
  damage: PropTypes.shape({
    id: PropTypes.string,
    part: PropTypes.string.isRequired,
    pricing: PropTypes.number,
    repairOperation: PropTypes.oneOf(Object.values(RepairOperation)),
    severity: PropTypes.oneOf(Object.values(Severity)),
  }),
  damageWithoutPart: PropTypes.shape({
    id: PropTypes.string,
    pricing: PropTypes.number,
    repairOperation: PropTypes.oneOf(Object.values(RepairOperation)),
    severity: PropTypes.oneOf(Object.values(Severity)),
  }),
  damageMode: PropTypes.oneOf(Object.values(DamageMode)),
  displayMode: PropTypes.oneOf(Object.values(DisplayMode)),
  partName: PropTypes.oneOf(carParts),
  vehicleType: PropTypes.oneOf(Object.values(VehicleType)),
};

export default CommonPropTypes;
