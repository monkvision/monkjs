import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { InspectionCompletePage } from '../../src/pages/InspectionCompletePage';

describe('Inspection Complete page', () => {
  it('should display a thank message', () => {
    const { unmount } = render(<InspectionCompletePage />);

    expect(useTranslation).toHaveBeenCalled();
    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalledWith('inspection-complete.thank-message');
    expect(screen.queryByText('inspection-complete.thank-message')).not.toBeNull();

    unmount();
  });
});
