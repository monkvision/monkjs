jest.mock('../../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));

import { render, screen } from '@testing-library/react';
import {
  InspectionGalleryFilterPill,
  InspectionGalleryFilterPillProps,
} from '../../../../src/components/InspectionGallery/InspectionGalleryTopBar/InspectionGalleryFilterPill';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '../../../../src';

function createProps(): InspectionGalleryFilterPillProps {
  return {
    isSelected: false,
    label: 'test-label-test',
    count: 12,
    onClick: jest.fn(),
  };
}

describe('InspectionGalleryFilterPill component', () => {
  it('should display a button that triggers the onClick event when clicked', () => {
    const props = createProps();
    const { unmount } = render(<InspectionGalleryFilterPill {...props} />);

    expectPropsOnChildMock(Button, { onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(props.onClick).not.toHaveBeenCalled();
    onClick();
    expect(props.onClick).toHaveBeenCalled();

    unmount();
  });

  it('should display a button with the proper label', () => {
    const testId = 'test';
    (Button as unknown as jest.Mock).mockImplementationOnce(({ children }) => (
      <div data-testid={testId}>{children}</div>
    ));
    const props = createProps();
    const { unmount } = render(<InspectionGalleryFilterPill {...props} />);

    expect(screen.getByTestId(testId).textContent).toEqual(`${props.label}${props.count}`);

    unmount();
  });
});
