import { useMonkState } from '@monkvision/common';
import { Image } from '@monkvision/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';

/**
 * Hook to manage the spotlight image behavior.
 */
export interface UseSpotlightImageProps {
  /**
   * The image to be displayed in the spotlight.
   */
  image: Image;
  /**
   * Flag indicating whether to show damage annotations on the image.
   */
  showDamage: boolean;
}

/**
 * State returned by the useSpotlightImage hook.
 */
export interface UseSpotlightImageState {
  /**
   * Which image to display in the spotlight (with or without damages).
   */
  backgroundImage: string;
  /**
   * Indicates if the mouse is currently over the spotlight image.
   */
  isMouseOver: boolean;
  /**
   * The current cursor style.
   */
  cursorStyle: string;
  /**
   * Reference to the TransformWrapper component for zooming the image.
   */
  ref: React.RefObject<ReactZoomPanPinchContentRef>;
  /**
   * List of activation keys for zooming.
   */
  activationKeys: string[];
  /**
   * Handler for mouse down events.
   */
  handleMouseDown: () => void;
  /**
   * Handler for mouse up events.
   */
  handleMouseUp: () => void;
}

/**
 * Hook to manage the spotlight image behavior.
 */
export function useSpotlightImage(props: UseSpotlightImageProps): UseSpotlightImageState {
  const { state } = useMonkState();
  const ref = useRef<ReactZoomPanPinchContentRef>(null);
  const [isMouseOver, setIsMouseOver] = useState(true);
  const [cursorStyle, setCursorStyle] = useState('grab');

  const isMac = navigator.userAgent.includes('Mac OS X');
  const activationKeys = isMac ? ['Meta'] : ['Control'];

  const handleMouseDown = () => {
    setCursorStyle('grabbing');
  };

  const handleMouseUp = () => {
    setCursorStyle('grab');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((isMac && event.metaKey) || (!isMac && event.ctrlKey)) {
      setCursorStyle('zoom-in');
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if ((isMac && !event.metaKey) || (!isMac && !event.ctrlKey)) {
      setCursorStyle('grab');
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as Element;
    const elementUnderMouse = target.closest('.spotlight-image');
    if (elementUnderMouse && elementUnderMouse.className === 'spotlight-image') {
      setIsMouseOver(true);
    } else {
      setIsMouseOver(false);
    }
  };

  const backgroundImage = useMemo(() => {
    const renderedOutput = state.renderedOutputs.find(
      (item) =>
        item.additionalData?.['description'] === 'rendering of detected damages' &&
        props.image.renderedOutputs.includes(item.id),
    );
    return props.showDamage ? renderedOutput?.path || props.image.path : props.image.path;
  }, [props.image, state.renderedOutputs, props.showDamage]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    ref.current?.resetTransform(0);
  }, [props.image]);

  return {
    backgroundImage,
    isMouseOver,
    handleMouseDown,
    handleMouseUp,
    ref,
    activationKeys,
    cursorStyle,
  };
}
