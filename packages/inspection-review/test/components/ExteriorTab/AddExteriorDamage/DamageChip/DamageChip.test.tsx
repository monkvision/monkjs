import { render } from '@testing-library/react';
import { DamageType } from '@monkvision/types';
import { DamageChip } from '../../../../../src/components/ExteriorTab/AddExteriorDamage/DamageChip/DamageChip';

type ButtonProps = {
  primaryColor?: string;
  secondaryColor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

const mockOnDamageClicked = jest.fn();
const mockTObj = jest.fn();

jest.mock('@monkvision/common-ui-web', () => ({
  Button: jest.fn(({ children, primaryColor, secondaryColor, onClick }: ButtonProps) => (
    <button data-primarycolor={primaryColor} data-secondarycolor={secondaryColor} onClick={onClick}>
      {children}
    </button>
  )),
}));

jest.mock('@monkvision/common', () => ({
  useObjectTranslation: jest.fn(() => ({ tObj: mockTObj })),
  damageTypeLabels: {
    [DamageType.SCRATCH]: { en: 'Scratch' },
  },
}));

describe('DamageChip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders translated label when available', () => {
    mockTObj.mockReturnValue('Scratch');

    const { getByText } = render(
      <DamageChip
        damage={DamageType.SCRATCH}
        selectedDamages={[]}
        onDamageClicked={mockOnDamageClicked}
      />,
    );

    expect(getByText('Scratch')).toBeDefined();
    expect(mockTObj).toHaveBeenCalledWith({ en: 'Scratch' });
  });

  it('renders fallback text when label missing', () => {
    mockTObj.mockReturnValue('');

    const { getByText } = render(
      <DamageChip
        damage={DamageType.DENT}
        selectedDamages={[]}
        onDamageClicked={mockOnDamageClicked}
      />,
    );

    expect(getByText('unknown')).toBeDefined();
  });

  it('uses primary color when damage is selected, secondary otherwise', () => {
    const { getByRole: getByRoleSelected, unmount } = render(
      <DamageChip
        damage={DamageType.SCRATCH}
        selectedDamages={[DamageType.SCRATCH]}
        onDamageClicked={mockOnDamageClicked}
      />,
    );

    const selectedButton = getByRoleSelected('button');
    expect(selectedButton.getAttribute('data-primarycolor')).toBe('primary');

    unmount();

    const { getByRole: getByRoleUnselected } = render(
      <DamageChip
        damage={DamageType.SCRATCH}
        selectedDamages={[]}
        onDamageClicked={mockOnDamageClicked}
      />,
    );

    const unselectedButton = getByRoleUnselected('button');
    expect(unselectedButton.getAttribute('data-primarycolor')).toBe('secondary');
  });

  it('calls onDamageClicked with damage on click', () => {
    const { getByRole } = render(
      <DamageChip
        damage={DamageType.SCRATCH}
        selectedDamages={[]}
        onDamageClicked={mockOnDamageClicked}
      />,
    );

    getByRole('button').click();

    expect(mockOnDamageClicked).toHaveBeenCalledWith(DamageType.SCRATCH);
  });
});
