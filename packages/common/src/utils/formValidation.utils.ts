const EMAIL_REGEX = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

/**
 * Basic type definition for a form validation function that can be used with the `useForm` hook.
 */
export type FormValidationFunction<K> = (value: K) => string | null;

/**
 * Basic form validation errors returned by avaliable validation functions in the SDK.
 */
export enum BasicValidationErrors {
  /**
   * Error returned when the field is required by no value has been passed.
   */
  REQUIRED = 'required',
  /**
   * Error returned when the value is not a valid email.
   */
  EMAIL_NOT_VALID = 'emailNotValid',
}

/**
 * Util function used to merge multiple validation functions into a single one. The first error discovered will be
 * returned.
 */
export function mergeValidationFunctions<K>(
  ...validateFunctions: FormValidationFunction<K>[]
): FormValidationFunction<K> {
  return (value: K) => {
    for (let i = 0; i < validateFunctions.length; i++) {
      const error = validateFunctions[i](value);
      if (error) {
        return error;
      }
    }
    return null;
  };
}

/**
 * Validation function for required fields.
 */
export function required(value: any): string | null {
  return value !== null && value !== undefined && value !== ''
    ? null
    : BasicValidationErrors.REQUIRED;
}

/**
 * Validation function for valid email fields.
 */
export function email(value: any): string | null {
  const error = required(value);
  if (error) {
    return error;
  }
  return typeof value === 'string' && value.match(EMAIL_REGEX) !== null
    ? null
    : BasicValidationErrors.EMAIL_NOT_VALID;
}
