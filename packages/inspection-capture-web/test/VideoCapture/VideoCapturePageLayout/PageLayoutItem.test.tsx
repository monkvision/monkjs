import { render, screen } from '@testing-library/react';
import {
  PageLayoutItem,
  PageLayoutItemProps,
} from '../../../src/VideoCapture/VideoCapturePageLayout';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Icon } from '@monkvision/common-ui-web';

const props: PageLayoutItemProps = {
  icon: 'add-photo',
  title: 'test-title-wow',
  description: 'test description test test',
};

describe('PageLayoutItem component', () => {
  it('should display an icon with the given name', () => {
    const { unmount } = render(<PageLayoutItem {...props} />);

    expectPropsOnChildMock(Icon, { icon: props.icon });

    unmount();
  });

  it('should display the given title', () => {
    const { unmount } = render(<PageLayoutItem {...props} />);

    expect(screen.queryByText(props.title)).not.toBeNull();

    unmount();
  });

  it('should display the given description', () => {
    const { unmount } = render(<PageLayoutItem {...props} />);

    expect(screen.queryByText(props.description)).not.toBeNull();

    unmount();
  });
});
