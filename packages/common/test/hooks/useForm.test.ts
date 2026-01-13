import { FormOptions, useForm } from '../../src';
import { act, renderHook } from '@testing-library/react';

interface TestFormValues {
  email: any;
  test: any;
}

const VALID_EMAIL_VALUE = 'test@mail.com';
const INVALID_EMAIL_ERROR = 'test-error';

function createProps(): FormOptions<TestFormValues> {
  return {
    initialValues: { email: '', test: '' },
    validate: {
      email: (value: string) => (value !== VALID_EMAIL_VALUE ? INVALID_EMAIL_ERROR : null),
    },
  };
}

describe('useForm hook', () => {
  it('should properly update the input value on change', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.getInputValue('email')).toEqual('');
    expect(result.current.getInputValue('test')).toEqual('');
    expect(result.current.getInputProps('email').value).toEqual('');
    expect(result.current.getInputProps('test').value).toEqual('');

    expect(typeof result.current.getInputProps('email').onChange).toBe('function');
    expect(typeof result.current.getInputProps('test').onChange).toBe('function');
    const email = 'email-value';
    const test = 'test-value';
    act(() => {
      result.current.getInputProps('email').onChange(email);
      result.current.getInputProps('test').onChange(test);
    });

    expect(result.current.getInputValue('email')).toEqual(email);
    expect(result.current.getInputValue('test')).toEqual(test);
    expect(result.current.getInputProps('email').value).toEqual(email);
    expect(result.current.getInputProps('test').value).toEqual(test);

    unmount();
  });

  it('should set the input to touched on blur', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.isInputTouchedOrDirty('email')).toBe(false);
    expect(result.current.isInputTouchedOrDirty('test')).toBe(false);

    expect(typeof result.current.getInputProps('email').onBlur).toBe('function');
    act(() => {
      result.current.getInputProps('email').onBlur();
    });

    expect(result.current.isInputTouchedOrDirty('email')).toBe(true);
    expect(result.current.isInputTouchedOrDirty('test')).toBe(false);

    unmount();
  });

  it('should set the input to dirty when the value changes', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.isInputTouchedOrDirty('email')).toBe(false);
    expect(result.current.isInputTouchedOrDirty('test')).toBe(false);

    expect(typeof result.current.getInputProps('email').onChange).toBe('function');
    act(() => {
      result.current.getInputProps('email').onChange('hello');
    });

    expect(result.current.isInputTouchedOrDirty('email')).toBe(true);
    expect(result.current.isInputTouchedOrDirty('test')).toBe(false);

    unmount();
  });

  it('should return the input errors when they exist', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.getInputError('email')).toBe(INVALID_EMAIL_ERROR);
    expect(result.current.getInputError('test')).toBe(null);

    expect(typeof result.current.getInputProps('email').onChange).toBe('function');
    act(() => {
      result.current.getInputProps('email').onChange(`${VALID_EMAIL_VALUE}-blabla`);
    });

    expect(result.current.getInputError('email')).toEqual(INVALID_EMAIL_ERROR);
    expect(result.current.getInputError('test')).toBe(null);

    act(() => {
      result.current.getInputProps('email').onChange(VALID_EMAIL_VALUE);
    });
    expect(result.current.getInputError('email')).toBe(null);
    expect(result.current.getInputError('test')).toBe(null);

    unmount();
  });

  it('should display the input error if the input is touched', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.isInputErrorDisplayed('email')).toBe(false);
    expect(result.current.isInputErrorDisplayed('test')).toBe(false);

    expect(typeof result.current.getInputProps('email').onBlur).toBe('function');
    act(() => {
      result.current.getInputProps('email').onBlur();
    });

    expect(result.current.isInputErrorDisplayed('email')).toBe(true);
    expect(result.current.isInputErrorDisplayed('test')).toBe(false);

    unmount();
  });

  it('should display the input error if the input is dirty', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useForm, { initialProps });

    expect(result.current.isInputErrorDisplayed('email')).toBe(false);
    expect(result.current.isInputErrorDisplayed('test')).toBe(false);

    expect(typeof result.current.getInputProps('email').onChange).toBe('function');
    act(() => {
      result.current.getInputProps('email').onChange(`${VALID_EMAIL_VALUE}-blabla`);
    });

    expect(result.current.isInputErrorDisplayed('email')).toBe(true);
    expect(result.current.isInputErrorDisplayed('test')).toBe(false);

    unmount();
  });
});
