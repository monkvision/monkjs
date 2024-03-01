import React from 'react';
import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import { FullscreenImageModal, FullscreenImageModalProps } from '../../src';

const mockProps: FullscreenImageModalProps = {
  show: true,
  label: 'Test Label',
  onClose: jest.fn(),
  url: 'test-image-url',
};

describe('FullsreenImageModal component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should', () => {
    const { unmount } = render(<FullscreenImageModal {...mockProps} />);

    const image = screen.getByTestId('image') as HTMLImageElement;
    expect(image.src).toContain(mockProps.url);
    expect(image.alt).toEqual(mockProps.label);
    expect(image.style.cursor).toEqual('zoom-in');
    expect(image.style.transform).toContain('scale(1)');

    fireEvent.click(image);
    expect(image.style.cursor).toEqual('zoom-out');
    expect(image.style.transform).toContain('scale(3)');

    unmount();
  });
});
