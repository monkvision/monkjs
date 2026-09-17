import { BoundingBox } from '@mediapipe/tasks-vision';
import { PixelDimensions } from '@monkvision/types';
import { CenterBox, CornerBox, PositioningMetrics, VideoContentRect } from '../types';

/**
 * Clamps a value between a minimum and a maximum.
 *
 * @param value The value to clamp.
 * @param min The lower bound.
 * @param max The upper bound.
 * @return The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts a box expressed with its center point into a box expressed with its top-left corner.
 *
 * @param box The box to convert.
 * @return The same box, in corner form.
 */
export function toCornerBox(box: CenterBox): CornerBox {
  return {
    x: box.xCenter - box.width / 2,
    y: box.yCenter - box.height / 2,
    width: box.width,
    height: box.height,
  };
}

/**
 * Converts a box expressed with its top-left corner into a box expressed with its center point.
 *
 * @param box The box to convert.
 * @return The same box, in center form.
 */
export function toCenterBox(box: CornerBox): CenterBox {
  return {
    xCenter: box.x + box.width / 2,
    yCenter: box.y + box.height / 2,
    width: box.width,
    height: box.height,
  };
}

/**
 * Clamps a box so that it is entirely contained in `[0, 1]²`.
 *
 * This is not optional. Despite what the MediaPipe typings suggest, the bounding boxes returned by the model are
 * floating point values that regularly extend past the bounds of the input image (a negative `originX`, or an
 * `originX + width` greater than the image width). Left unclamped, a vehicle that is half out of frame produces an
 * area ratio greater than 1 and completely meaningless containment metrics.
 *
 * @param box The box to clamp.
 * @return The clamped box, or null if clamping left it degenerate.
 */
export function clampBox(box: CenterBox): CenterBox | null {
  const corners = toCornerBox(box);
  const left = clamp(corners.x, 0, 1);
  const top = clamp(corners.y, 0, 1);
  const right = clamp(corners.x + corners.width, 0, 1);
  const bottom = clamp(corners.y + corners.height, 0, 1);

  if (right <= left || bottom <= top) {
    return null;
  }
  return toCenterBox({ x: left, y: top, width: right - left, height: bottom - top });
}

/**
 * Converts a bounding box returned by the MediaPipe object detector into a normalized box.
 *
 * @param box The bounding box, expressed in pixels of the image that was given to the detector.
 * @param source The dimensions of the image that was given to the detector.
 * @return The normalized box, or null if the box is rotated or degenerate.
 */
export function normalizeBoundingBox(box: BoundingBox, source: PixelDimensions): CenterBox | null {
  if (!source.width || !source.height || box.width <= 0 || box.height <= 0) {
    return null;
  }
  // The `angle` field is a rotation around the TOP LEFT CORNER of the non-rotated box, so a non-zero value would
  // invalidate the corner to center conversion below. EfficientDet always returns 0, so this is mostly here to
  // document the assumption.
  if (Math.abs(box.angle ?? 0) > 0.5) {
    return null;
  }
  return clampBox(
    toCenterBox({
      x: box.originX / source.width,
      y: box.originY / source.height,
      width: box.width / source.width,
      height: box.height / source.height,
    }),
  );
}

/**
 * Computes the area of a box.
 *
 * @param box The box to measure.
 * @return The area of the box, in normalized units.
 */
export function getArea(box: CenterBox): number {
  return box.width * box.height;
}

/**
 * Computes the Intersection over Union of two boxes. Used both to keep a track locked onto the same vehicle across
 * ticks, and to score how well a candidate fills the target frame.
 *
 * @param a The first box.
 * @param b The second box.
 * @return A value between 0 (disjoint) and 1 (identical).
 */
export function getIou(a: CenterBox, b: CenterBox): number {
  const boxA = toCornerBox(a);
  const boxB = toCornerBox(b);
  const overlapWidth =
    Math.min(boxA.x + boxA.width, boxB.x + boxB.width) - Math.max(boxA.x, boxB.x);
  const overlapHeight =
    Math.min(boxA.y + boxA.height, boxB.y + boxB.height) - Math.max(boxA.y, boxB.y);

  if (overlapWidth <= 0 || overlapHeight <= 0) {
    return 0;
  }
  const intersection = overlapWidth * overlapHeight;
  const union = getArea(a) + getArea(b) - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Computes how far a box pokes outside of another one, normalized by the smallest dimension of the target box.
 *
 * A single scalar is used rather than a boolean so that containment can be given a hysteresis band like every other
 * metric. Negative values mean the box is strictly inside the target, with margin.
 *
 * This metric also catches a failure mode that the area ratio structurally cannot see : a vehicle can have an area
 * ratio of 0.7 while being 1.05 times wider than the target, which is the right area but too wide to fit.
 *
 * @param box The box to test.
 * @param target The box it should fit inside of.
 * @return The worst axis excursion beyond a target edge, in target box units.
 */
export function getOverflow(box: CenterBox, target: CenterBox): number {
  const inner = toCornerBox(box);
  const outer = toCornerBox(target);
  const worst = Math.max(
    outer.x - inner.x,
    inner.x + inner.width - (outer.x + outer.width),
    outer.y - inner.y,
    inner.y + inner.height - (outer.y + outer.height),
  );
  return worst / Math.min(target.width, target.height);
}

/**
 * Computes the three scalars the positioning state machine runs on.
 *
 * Note: The center error is normalized per axis by the *target box* dimensions, not by the frame. Normalized frame
 * coordinates are anisotropic, so a raw euclidean distance in that space mixes units : on a 3840x2160 frame a `dx` of
 * 0.1 is 384px while a `dy` of 0.1 is only 216px, and a single threshold on that would behave differently in portrait
 * and in landscape. As defined here, the value is dimensionless, aspect-agnostic and identical on every device.
 *
 * @param box The smoothed vehicle box.
 * @param target The static target frame.
 * @return The positioning metrics.
 */
export function getPositioningMetrics(box: CenterBox, target: CenterBox): PositioningMetrics {
  return {
    // Both areas pick up the same 1 / (frameWidth * frameHeight) factor, which cancels out : this ratio is exact
    // despite the anisotropic normalization.
    areaRatio: getArea(box) / getArea(target),
    centerError: Math.max(
      Math.abs(box.xCenter - target.xCenter) / target.width,
      Math.abs(box.yCenter - target.yCenter) / target.height,
    ),
    overflow: getOverflow(box, target),
  };
}

/**
 * Computes the rectangle actually painted by a video element, relative to a positioning ancestor.
 *
 * Video elements are displayed with `object-fit: contain` (per the HTML standard's UA stylesheet) and
 * `object-position: 50% 50%`, so the painted frames are letterboxed and centered inside the element's box. Two levels
 * of offset are accumulated : where the video box sits inside the container, and where the painted frames sit inside
 * the video box. Both coincide with the current Camera styling, but that is an implementation detail of a component
 * this POC does not own.
 *
 * Note: `getBoundingClientRect` is used rather than `clientWidth` / `clientHeight` because the latter are rounded to
 * integers, and on a high density screen the layout box is routinely fractional. Both rects carry the same ancestor
 * transforms, so subtracting them yields the correct offset.
 *
 * @param video The video element displaying the camera preview.
 * @param container The positioning ancestor the overlay is absolutely positioned inside of.
 * @return The painted content rectangle, or null if the video has no intrinsic dimensions yet.
 */
export function getVideoContentRect(
  video: HTMLVideoElement,
  container: HTMLElement,
): VideoContentRect | null {
  const { videoWidth, videoHeight } = video;
  const videoRect = video.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (!videoWidth || !videoHeight || !videoRect.width || !videoRect.height) {
    return null;
  }
  const scale = Math.min(videoRect.width / videoWidth, videoRect.height / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;

  return {
    offsetX: videoRect.left - containerRect.left + (videoRect.width - width) / 2,
    offsetY: videoRect.top - containerRect.top + (videoRect.height - height) / 2,
    width,
    height,
    frameWidth: videoWidth,
    frameHeight: videoHeight,
  };
}

/**
 * Computes the dimensions of the offscreen canvas the video frames are downscaled into before inference, preserving
 * the source aspect ratio.
 *
 * @param source The intrinsic dimensions of the camera frames.
 * @param targetWidth The requested width of the canvas, or null to use the source dimensions as-is.
 * @return The dimensions of the inference source.
 */
export function getInferenceDimensions(
  source: PixelDimensions,
  targetWidth: number | null,
): PixelDimensions {
  if (!targetWidth || targetWidth >= source.width) {
    return source;
  }
  return {
    width: targetWidth,
    height: Math.max(1, Math.round((targetWidth * source.height) / source.width)),
  };
}
