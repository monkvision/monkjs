import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BackdropDialog, Button } from '@monkvision/common-ui-web';
import {
  PhotoCaptureHUDOcrConfirmModal,
  PhotoCaptureHUDOcrConfirmModalProps,
} from '../../../../src/PhotoCapture/PhotoCaptureHUD/OcrOverlay/PhotoCaptureHUDOcrConfirmModal';

function createProps(
  overrides?: Partial<PhotoCaptureHUDOcrConfirmModalProps>,
): PhotoCaptureHUDOcrConfirmModalProps {
  return {
    text: 'TEST-VIN-123',
    imageUri: 'data:image/jpeg;base64,test',
    onConfirm: jest.fn(),
    onReject: jest.fn(),
    ...overrides,
  };
}

describe('PhotoCaptureHUDOcrConfirmModal', () => {
  beforeEach(() => {
    // Render the dialog prop so we can query its content.
    (BackdropDialog as jest.Mock).mockImplementation(({ dialog }: { dialog: React.ReactNode }) => (
      <>{dialog}</>
    ));
    // Render a real button so fireEvent.click works.
    (Button as jest.Mock).mockImplementation(
      ({
        children,
        onClick,
        disabled,
      }: {
        children: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
      }) => (
        <button type='button' onClick={onClick} disabled={!!disabled}>
          {children}
        </button>
      ),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('normal state (no special flags)', () => {
    it('renders the detected text', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps()} />);
      expect(screen.getByText('TEST-VIN-123')).toBeInTheDocument();
    });

    it('renders a Yes button and a No button', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps()} />);
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('calls onConfirm when Yes is clicked', () => {
      const onConfirm = jest.fn();
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ onConfirm })} />);
      fireEvent.click(screen.getByText('Yes'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onReject when No is clicked', () => {
      const onReject = jest.fn();
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ onReject })} />);
      fireEvent.click(screen.getByText('No'));
      expect(onReject).toHaveBeenCalledTimes(1);
    });

    it('renders the frame image', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ imageUri: 'blob:test-uri' })} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', 'blob:test-uri');
    });
  });

  describe('editing state (isEditing=true)', () => {
    it('renders a text input', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isEditing: true, editValue: 'ABC' })} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders Cancel and Confirm buttons', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isEditing: true })} />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('calls onEditCancel when Cancel is clicked', () => {
      const onEditCancel = jest.fn();
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isEditing: true, onEditCancel })} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(onEditCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when Confirm is clicked', () => {
      const onConfirm = jest.fn();
      render(
        <PhotoCaptureHUDOcrConfirmModal
          {...createProps({ isEditing: true, editValue: 'VALUE', onConfirm })}
        />,
      );
      fireEvent.click(screen.getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('disables Confirm when editValue is empty', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isEditing: true, editValue: '' })} />);
      expect(screen.getByText('Confirm').closest('button')).toBeDisabled();
    });

    it('uppercases VIN input characters', () => {
      const onEditChange = jest.fn();
      render(
        <PhotoCaptureHUDOcrConfirmModal
          {...createProps({ isEditing: true, editValue: '', mode: 'vin', onEditChange })}
        />,
      );
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
      expect(onEditChange).toHaveBeenCalledWith('ABC');
    });

    it('strips non-digit characters for odometer input', () => {
      const onEditChange = jest.fn();
      render(
        <PhotoCaptureHUDOcrConfirmModal
          {...createProps({ isEditing: true, editValue: '', mode: 'odometer', onEditChange })}
        />,
      );
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc123def' } });
      expect(onEditChange).toHaveBeenCalledWith('123');
    });
  });

  describe('OCR failed state (ocrFailed=true)', () => {
    it('renders the OCR failure message', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ ocrFailed: true })} />);
      expect(screen.getByText(/Unable to detect the text/)).toBeInTheDocument();
    });

    it('renders a Continue button', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ ocrFailed: true })} />);
      expect(screen.getByText('Continue')).toBeInTheDocument();
    });

    it('calls onOcrFailed when Continue is clicked', () => {
      const onOcrFailed = jest.fn();
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ ocrFailed: true, onOcrFailed })} />);
      fireEvent.click(screen.getByText('Continue'));
      expect(onOcrFailed).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalid reading state (isInvalidReading=true)', () => {
    it('renders the invalid reading message', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isInvalidReading: true })} />);
      expect(screen.getByText(/not valid/i)).toBeInTheDocument();
    });

    it('renders a Close button', () => {
      render(<PhotoCaptureHUDOcrConfirmModal {...createProps({ isInvalidReading: true })} />);
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('calls onInvalidReading when Close is clicked', () => {
      const onInvalidReading = jest.fn();
      render(
        <PhotoCaptureHUDOcrConfirmModal
          {...createProps({ isInvalidReading: true, onInvalidReading })}
        />,
      );
      fireEvent.click(screen.getByText('Close'));
      expect(onInvalidReading).toHaveBeenCalledTimes(1);
    });
  });
});
