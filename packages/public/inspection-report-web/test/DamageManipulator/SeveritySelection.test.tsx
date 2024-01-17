const { severitiesWithIcon, SeverityWithIcon } = jest.requireActual(
  '../../src/DamageManipulator/common/SeveritiesWithIcon',
);

jest.mock('@monkvision/common-ui-web');
jest.mock('../../src/DamageManipulator/common/SeveritiesWithIcon', () => ({
  SeverityWithIcon,
  severitiesWithIcon,
}));

import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { SeveritySelection } from '../../src/DamageManipulator/SeveritySelection';

describe('SeveritySelection component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button and no-part by default', () => {
    const onSeverityChange = jest.fn();
    const buttonMock = Button as unknown as jest.Mock;

    const { unmount } = render(<SeveritySelection onSeverityChange={onSeverityChange} />);

    expect(buttonMock).toHaveBeenCalledTimes(severitiesWithIcon.length);

    unmount();
  });
});
