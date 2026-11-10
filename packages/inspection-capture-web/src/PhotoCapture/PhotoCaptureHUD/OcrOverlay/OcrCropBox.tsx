import { styles, STROKE, RADIUS, COLOR_IDLE, COLOR_CONFIRMED } from './PhotoCaptureHUDOcrOverlay.styles';

export interface OcrCropBoxProps {
  /** Width of the crop box in pixels. */
  boxW: number;
  /** Height of the crop box in pixels. */
  boxH: number;
  /** When true, hides the idle dashed border (a reading is being confirmed or fill is complete). */
  isIdleHidden: boolean;
  /** Length of the filled arc for the progress animation. */
  filledLength: number;
  /** Total perimeter of the rounded rectangle, used as the stroke-dasharray gap. */
  perimeter: number;
}

/** Animated rounded-rectangle frame drawn over the OCR crop region. */
export const OcrCropBox = ({ boxW, boxH, isIdleHidden, filledLength, perimeter }: OcrCropBoxProps) => {
  const rectProps = {
    x: STROKE / 2,
    y: STROKE / 2,
    width: boxW - STROKE,
    height: boxH - STROKE,
    rx: RADIUS,
    fill: 'none',
  };

  return (
    <svg viewBox={`0 0 ${boxW} ${boxH}`} style={styles.svg} xmlns='http://www.w3.org/2000/svg'>
      <rect {...rectProps} stroke='#ffffff' strokeWidth={STROKE} opacity={0.2} />
      <rect
        {...rectProps}
        stroke={COLOR_IDLE}
        strokeWidth={STROKE}
        strokeDasharray='8 6'
        opacity={isIdleHidden ? 0 : 0.6}
        style={styles.rectOpacity}
      />
      <rect
        {...rectProps}
        stroke={COLOR_CONFIRMED}
        strokeWidth={STROKE}
        strokeDasharray={`${filledLength} ${perimeter}`}
        strokeLinecap='round'
        style={styles.rectDash}
      />
    </svg>
  );
}
