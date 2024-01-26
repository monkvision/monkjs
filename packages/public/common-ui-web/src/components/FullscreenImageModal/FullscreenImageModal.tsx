import React, { useState } from 'react';
import { FullscreenModal } from '../FullscreenModal';
import { styles } from './FullscreenImageModal.styles';

/**
 * Props for the FullscreenImageModal component.
 */
export interface FullscreenImageModalProps {
  show: boolean;
  label?: string;
  onClose?: () => void;
  url: string;
}

function calculatePosition(
  viewPort: number,
  imageDimension: number,
  clickPosition: number,
  scale: number,
) {
  if (viewPort > imageDimension * 3) {
    return 0;
  }
  const blackBand = (viewPort - imageDimension) / 2;
  const maxPosition = (imageDimension - blackBand) / scale;
  return Math.min(maxPosition, Math.max(-maxPosition, imageDimension / 2 - clickPosition));
}

/**
 * FullscreenImageModal component used to display a full-screen modal for an image and able the user to zoom on it.
 */
export function FullscreenImageModal({
  show,
  label = '',
  onClose,
  url,
}: FullscreenImageModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const scale = 3;

  function handleZoom(event: React.MouseEvent<HTMLElement>) {
    if (isZoomed) {
      setPosition({ x: 0, y: 0 });
    } else {
      const positionX = calculatePosition(
        window.innerWidth,
        event.currentTarget.offsetWidth,
        event.nativeEvent.offsetX,
        scale,
      );
      const positionY = calculatePosition(
        window.innerHeight,
        event.currentTarget.offsetHeight,
        event.nativeEvent.offsetY,
        scale,
      );
      setPosition({ x: positionX, y: positionY });
    }
    setIsZoomed(!isZoomed);
  }

  return (
    <FullscreenModal show={show} title={label} onClose={onClose}>
      <img
        style={{
          ...styles['image'],
          transform: `scale(${isZoomed ? 3 : 1}) translate(${position.x}px, ${position.y}px)`,
          cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          zIndex: isZoomed ? '10' : 'auto',
        }}
        src={url}
        alt={label}
        onClick={handleZoom}
        onKeyDown={() => {}}
        data-testid='image'
      />
    </FullscreenModal>
  );
}
