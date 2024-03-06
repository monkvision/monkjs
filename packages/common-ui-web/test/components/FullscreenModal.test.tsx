import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FullscreenModal } from '../../src';

describe('FullsreenModal component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOnClose = jest.fn();
  const title = 'test title';
  const content = 'test content';

  it('should not render modal when show is false', () => {
    const { unmount } = render(<FullscreenModal show={false}></FullscreenModal>);
    expect(screen.queryByText(title)).toBeNull();
    expect(screen.queryByText(content)).toBeNull();

    unmount();
  });

  it('renders modal with title and content when show is true', () => {
    const { unmount } = render(
      <FullscreenModal show={true} onClose={mockOnClose} title={title}>
        {content}
      </FullscreenModal>,
    );
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();

    unmount();
  });
});
