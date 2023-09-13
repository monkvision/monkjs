import { render, screen } from '@testing-library/react';
import {
  ComponentType,
  createRef,
  CSSProperties,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactElement,
  RefAttributes,
  RefObject,
} from 'react';

/**
 * Expects that the given props were passed to the given child component. The child component has to be a Jest Mocked
 * functional component, created using the following syntax : `const ChildMock = jest.fn(() => <div />);`.
 *
 * If you want to test the children passed to the child component, you can add the `children` property to the props
 * object.
 */
export function expectPropsOnChildMock(
  Component: jest.Mock,
  props: { [key: string]: unknown },
): void {
  expect(Component).toHaveBeenCalledWith(expect.objectContaining(props), expect.anything());
}

export type SimpleTestProps = { [key: string]: unknown };

/**
 * Expects that the given component will pass down the className given to it to the child HTMLElement that has the given
 * test ID.
 */
export function expectComponentToPassDownClassNameToHTMLElement(
  Component: ComponentType<{ className: string | undefined }>,
  elementTestId: string,
): void {
  const className = 'pass-down-class-name-test';
  const { unmount } = render(<Component className={className} />);

  expect(screen.getByTestId(elementTestId).className).toContain(className);
  unmount();
}

/**
 * Expects that the given component will pass down the style given to it to the child HTMLElement that has the given
 * test ID.
 */
export function expectComponentToPassDownStyleToHTMLElement(
  Component: ComponentType<{ style: CSSProperties | undefined }>,
  elementTestId: string,
  testStyleValue?: CSSProperties,
): void {
  const style = testStyleValue ?? { zIndex: 123456 };
  const { unmount } = render(<Component style={style} />);

  Object.keys(style).forEach((styleProp) => {
    expect(screen.getByTestId(elementTestId).style[styleProp as keyof CSSStyleDeclaration]).toEqual(
      String(style[styleProp as keyof CSSProperties]),
    );
  });
  unmount();
}

/**
 * Expects that the given component will pass down other props given to it to the child HTMLElement that has the given
 * test ID.
 */
export function expectComponentToPassDownOtherPropsToHTMLElement<P extends SimpleTestProps>(
  Component: ComponentType<P>,
  elementTestId: string,
  testPropValues: P = { id: 'test-pass-down-id' } as unknown as P,
): void {
  const { unmount } = render(<Component {...testPropValues} />);

  const testEl = screen.getByTestId(elementTestId);
  expect(testEl).toEqual(expect.objectContaining(testPropValues));
  unmount();
}

/**
 * Expect the HTMLElement ith the given ID to have the given ref.
 */
export function expectHTMLElementToHaveRef<T>(
  elementTestId: string,
  ref: RefObject<T>,
  testPropValues: Partial<T> = { id: 'test-pass-down-id' } as unknown as Partial<T>,
) {
  expect(ref.current).toBeDefined();
  Object.keys(testPropValues).forEach((prop) => {
    if (ref.current) {
      const key = prop as keyof T;
      // eslint-disable-next-line no-param-reassign
      ref.current[key] = testPropValues[key] as NonNullable<T>[keyof T];
    }
  });
  Object.keys(testPropValues).forEach((prop) => {
    expect(screen.getByTestId(elementTestId)[prop as keyof HTMLElement]).toEqual(
      testPropValues[prop as keyof T],
    );
  });
}

/**
 * Expects that the given component will pass down the ref given to it to the child HTMLElement that has the given test
 * ID.
 */
export function expectComponentToPassDownRefToHTMLElement<T>(
  Component: ForwardRefExoticComponent<RefAttributes<T>>,
  elementTestId: string,
  testPropValues: Partial<T> = { id: 'test-pass-down-id' } as unknown as Partial<T>,
): void {
  const ref = createRef<T>();
  const { unmount, rerender } = render(<Component ref={ref} />);
  rerender(<Component ref={ref} />);

  expectHTMLElementToHaveRef(elementTestId, ref, testPropValues);
  unmount();
}
