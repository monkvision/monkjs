import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getLanguage } from '@monkvision/common';
import { AddDamage } from '@monkvision/types';
import {
  SightGuideline,
  SightGuidelineProps,
} from '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightGuideline';

const GUIDELINE_TEST_ID = 'guideline';
const CONTAINER_TEST_ID = 'container';
const CHECKBOX_CONTAINER_TEST_ID = 'checkbox-container';
const BUTTON_TEST_ID = 'button';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
}));
function createProps(): SightGuidelineProps {
  return {
    sightId: 'sightId-test-1',
    sightGuidelines: [
      {
        en: 'en-test',
        fr: 'fr-test',
        de: 'de-test',
        nl: 'nl-test',
        sightIds: ['sightId-test-1', 'sightId-test-2'],
      },
    ],
    addDamage: AddDamage.PART_SELECT,
    disabled: false,
    enableDefaultMessage: false,
    onDisableSightGuidelines: jest.fn(),
  };
}

describe('SightGuideline component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hide the guideline when disabled is true', () => {
    const props = { ...createProps(), disabled: true };
    (getLanguage as jest.Mock).mockImplementationOnce(() => 'en');
    const { unmount } = render(<SightGuideline {...props} />);
    expect(screen.getByTestId(CONTAINER_TEST_ID).children.length).toBe(0);

    unmount();
  });

  it('should render the guideline when disabled is false', () => {
    const props = createProps();
    (getLanguage as jest.Mock).mockImplementationOnce(() => 'en');
    const { unmount } = render(<SightGuideline {...props} />);
    expect(screen.getByTestId(GUIDELINE_TEST_ID)).toBeInTheDocument();

    unmount();
  });

  it('should render the default message if no guideline is found', () => {
    const props = { ...createProps(), enableDefaultMessage: true, sightGuidelines: [] };
    const { unmount } = render(<SightGuideline {...props} />);
    expect(screen.getByTestId(GUIDELINE_TEST_ID)).toHaveTextContent(
      'photo.hud.guidelines.defaultGuideline',
    );

    unmount();
  });

  it('should call onDisableSightGuidelines when checkbox is checked and button is clicked', async () => {
    const props = createProps();
    (getLanguage as jest.Mock).mockImplementation(() => 'en');
    const { unmount } = render(<SightGuideline {...props} />);
    const checkbox = screen.getByTestId(CHECKBOX_CONTAINER_TEST_ID);
    const button = screen.getByTestId(BUTTON_TEST_ID);

    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toHaveAttribute('aria-checked', 'true'); // Ensure the checkbox is checked
    });

    fireEvent.click(button);

    expect(props.onDisableSightGuidelines).toHaveBeenCalled();

    unmount();
  });
});
