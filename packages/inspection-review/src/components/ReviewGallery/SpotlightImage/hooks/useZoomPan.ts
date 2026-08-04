import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const DEFAULT_MIN_SCALE = 1;
const DEFAULT_MAX_SCALE = 8;
const WHEEL_ZOOM_SENSITIVITY = 0.0015;

/**
 * Props accepted by the useZoomPan hook.
 */
export interface UseZoomPanProps {
  /**
   * List of keys that must be held for the mouse wheel to zoom.
   */
  activationKeys: string[];
  /**
   * Minimum allowed zoom scale.
   * @default 1
   */
  minScale?: number;
  /**
   * Maximum allowed zoom scale.
   * @default 8
   */
  maxScale?: number;
  /**
   * Called when the user starts dragging to pan the content.
   */
  onPanStart?: () => void;
  /**
   * Called when the user stops dragging.
   */
  onPanEnd?: () => void;
}

/**
 * State returned by the useZoomPan hook.
 */
export interface UseZoomPanState {
  /**
   * Ref to be placed on the element that listens for wheel and pointer events, and clips the zoomed content.
   */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Ref to be placed on the element that gets translated and scaled.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Style to apply to the content element to reflect the current zoom and pan state.
   */
  contentStyle: CSSProperties;
  /**
   * Whether the content is currently being dragged.
   */
  isPanning: boolean;
  /**
   * Pointer down event handler to be attached to the wrapper element.
   */
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  /**
   * Pointer move event handler to be attached to the wrapper element.
   */
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  /**
   * Pointer up event handler to be attached to the wrapper element.
   */
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
  /**
   * Resets the zoom and pan state back to its initial value.
   */
  reset: () => void;
}

interface PanStart {
  pointerX: number;
  pointerY: number;
  positionX: number;
  positionY: number;
}

/**
 * Hook implementing a minimal wheel-zoom (gated by an activation key) and drag-to-pan behavior for an element,
 *
 * Note: Pinch-to-zoom on touch devices is intentionally not supported.
 */
export function useZoomPan({
  activationKeys,
  minScale = DEFAULT_MIN_SCALE,
  maxScale = DEFAULT_MAX_SCALE,
  onPanStart,
  onPanEnd,
}: UseZoomPanProps): UseZoomPanState {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<PanStart | null>(null);
  const [scale, setScale] = useState(minScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const clampPosition = useCallback((x: number, y: number, targetScale: number) => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) {
      return { x, y };
    }
    const minX = Math.min(0, wrapper.offsetWidth - content.offsetWidth * targetScale);
    const minY = Math.min(0, wrapper.offsetHeight - content.offsetHeight * targetScale);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  }, []);

  const reset = useCallback(() => {
    setScale(minScale);
    setPosition({ x: 0, y: 0 });
  }, [minScale]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return undefined;
    }

    const handleWheel = (event: WheelEvent) => {
      const isActivationKeyPressed = activationKeys.some((key) =>
        event.getModifierState(key as 'Meta' | 'Control'),
      );
      if (!isActivationKeyPressed) {
        return;
      }
      // Supress browser page scroll/zoom while zooming the image
      event.preventDefault();

      const rect = wrapper.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;
      const factor = 1 - event.deltaY * WHEEL_ZOOM_SENSITIVITY;

      setScale((prevScale) => {
        const nextScale = Math.min(maxScale, Math.max(minScale, prevScale * factor));
        const ratio = nextScale / prevScale;
        setPosition((prevPosition) =>
          clampPosition(
            cursorX - (cursorX - prevPosition.x) * ratio,
            cursorY - (cursorY - prevPosition.y) * ratio,
            nextScale,
          ),
        );
        return nextScale;
      });
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    return () => wrapper.removeEventListener('wheel', handleWheel);
  }, [activationKeys, minScale, maxScale, clampPosition]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      panStartRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        positionX: position.x,
        positionY: position.y,
      };
      setIsPanning(true);
      event.currentTarget.setPointerCapture?.(event.pointerId);
      onPanStart?.();
    },
    [position, onPanStart],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const panStart = panStartRef.current;
      if (!panStart) {
        return;
      }
      setPosition(
        clampPosition(
          panStart.positionX + (event.clientX - panStart.pointerX),
          panStart.positionY + (event.clientY - panStart.pointerY),
          scale,
        ),
      );
    },
    [scale, clampPosition],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!panStartRef.current) {
        return;
      }
      panStartRef.current = null;
      setIsPanning(false);
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      onPanEnd?.();
    },
    [onPanEnd],
  );

  const contentStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
      transformOrigin: '0 0',
    }),
    [position, scale],
  );

  return {
    wrapperRef,
    contentRef,
    contentStyle,
    isPanning,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    reset,
  };
}
