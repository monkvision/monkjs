const ALLOWED_COMPLIANCE_REASONS = [
  'NO_CAR_BODY',
  'LOW_RESOLUTION',
  'BLURRINESS',
  'UNDEREXPOSURE',
  'OVEREXPOSURE',
  'LENS_FLARE',
  'DIRTINESS',
  'SNOWNESS',
  'WETNESS',
  'REFLECTIONS',
];

export default function filterUnwantedComplianceReasons(reasons) {
  if (!Array.isArray(reasons)) {
    return reasons;
  }
  return reasons.filter(
    (reason) => ALLOWED_COMPLIANCE_REASONS
      .findIndex((allowedReason) => reason.toUpperCase().startsWith(allowedReason)) !== -1,
  );
}

/*
 * For reference, here is the complete list of compliances reasons known to this date.
 *   - Samy 22/11/23
 * OTHER
 * LOW_RESOLUTION
 * BLURRINESS
 * UNDEREXPOSURE
 * OVEREXPOSURE
 * LENS_FLARE
 * DIRTINESS
 * SNOWNESS
 * WETNESS
 * REFLECTIONS
 * UNKNOWN_SIGHT
 * UNKNOWN_VIEWPOINT
 * NO_CAR_BODY
 * NO_VEHICLE
 * WRONG_ANGLE
 * WRONG_CENTER_PART
 * MISSING_PARTS
 * HIDDEN_PARTS
 * TOO_ZOOMED
 * NOT_ZOOMED_ENOUGH
 * INTERIOR_NOT_SUPPORTED
 * MISSING
 * LOW_QUALITY
 */
