import { render, screen } from '@testing-library/react';
import {
  IntroLayoutItem,
  IntroLayoutItemProps,
} from '../../../src/VideoCapture/VideoCaptureIntroLayout';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Icon } from '@monkvision/common-ui-web';

const props: IntroLayoutItemProps = {
  icon: 'add-photo',
  title: 'test-title-wow',
  description: 'test description test test',
};

describe('IntroLayoutItem component', () => {
  it('should display an icon with the given name', () => {
    const { unmount } = render(<IntroLayoutItem {...props} />);

    expectPropsOnChildMock(Icon, { icon: props.icon });

    unmount();
  });

  it('should display the given title', () => {
    const { unmount } = render(<IntroLayoutItem {...props} />);

    expect(screen.queryByText(props.title)).not.toBeNull();

    unmount();
  });

  it('should display the given description', () => {
    const { unmount } = render(<IntroLayoutItem {...props} />);

    expect(screen.queryByText(props.description)).not.toBeNull();

    unmount();
  });
});
