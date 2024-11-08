import { useCallback, useState } from 'react';
import { useObjectMemo } from './useObjectMemo';
import { FormValidationFunction } from '../utils';

/**
 * Base type definition for form initial values.
 */
export type FormValuesBaseType = Record<string, any>;

/**
 * Type definitions for the input properties that needs to be passed to a form input.
 */
export interface FormInputProps<T extends FormValuesBaseType> {
  value: T[keyof T];
  onChange: (value: T[keyof T]) => void;
  onBlur: () => void;
}

/**
 * Options used to set up a form using the `useForm` hook.
 */
export interface FormOptions<T extends FormValuesBaseType> {
  /**
   * Initial values of the form. This property is used to set the global shape of the form.
   */
  initialValues: T;
  /**
   * Optional validation functions used to validate the form fields.
   */
  validate?: { [Key in keyof T]?: FormValidationFunction<T[Key]> };
}

/**
 * Form handler used to manage a form using the `useForm` hook.
 */
export interface Form<T extends FormValuesBaseType> {
  /**
   * Function used to get the value of a form input.
   */
  getInputValue: (name: keyof T) => T[keyof T];
  /**
   * Function used to get the pass through props of a form input.
   */
  getInputProps: (name: keyof T) => FormInputProps<T>;
  /**
   * Function indicating if the form is valid or not (i.e. every input in the form is valid).
   */
  isValid: () => boolean;
  /**
   * Function that returns the validation error of the given form input.
   */
  getInputError: (name: keyof T) => string | null;
  /**
   * Function indicating if the error message under a form input should be displayed or not.
   */
  isInputErrorDisplayed: (name: keyof T) => boolean;
  /**
   * Function indicating if a form input has been touched or is dirty.
   */
  isInputTouchedOrDirty: (name: keyof T) => boolean;
}

function mapFormValues<T extends FormValuesBaseType, K>(values: T, val: K): Record<keyof T, K> {
  return Object.keys(values).reduce(
    (prev, curr) => ({ ...prev, [curr]: val }),
    {} as Record<keyof T, K>,
  );
}

/**
 * Custom hook used to manage forms in ReactJs. Please refer to
 * [the official documentation](https://github.com/monkvision/monkjs/blob/main/packages/common/README/HOOKS.md) for more
 * details on how to use this hook.
 */
export function useForm<T extends FormValuesBaseType = FormValuesBaseType>({
  initialValues,
  validate,
}: FormOptions<T>): Form<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [touchedInputs, setTouchedInputs] = useState<Record<keyof T, boolean>>(
    mapFormValues(initialValues, false),
  );

  const touch = useCallback((name: keyof T) => {
    setTouchedInputs((previousValues) => ({ ...previousValues, [name]: true }));
  }, []);

  const getInputValue = useCallback((name: keyof T) => values[name], [values]);

  const getInputProps: (name: keyof T) => FormInputProps<T> = useCallback(
    (name: keyof T) => ({
      value: values[name],
      onChange: (value: T[keyof T]) => {
        setValues((previousValues) => ({ ...previousValues, [name]: value }));
        touch(name);
      },
      onBlur: () => {
        touch(name);
      },
    }),
    [values, touch],
  );

  const getInputError = useCallback(
    (name: keyof T) => validate?.[name]?.(values[name]) ?? null,
    [validate, values],
  );

  const isValid = useCallback(
    () => (Object.keys(initialValues) as (keyof T)[]).every((name) => getInputError(name) === null),
    [initialValues, getInputError],
  );

  const isInputTouchedOrDirty = useCallback(
    (name: keyof T) => touchedInputs[name] || values[name] !== initialValues[name],
    [touchedInputs, values, initialValues],
  );

  const isInputErrorDisplayed = useCallback(
    (name: keyof T) => isInputTouchedOrDirty(name) && !!getInputError(name),
    [isInputTouchedOrDirty, getInputError],
  );

  return useObjectMemo({
    getInputValue,
    getInputProps,
    isValid,
    getInputError,
    isInputErrorDisplayed,
    isInputTouchedOrDirty,
  });
}
