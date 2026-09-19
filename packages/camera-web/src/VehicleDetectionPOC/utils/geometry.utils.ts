import { BoundingBox } from '@mediapipe/tasks-vision';
import { PixelDimensions } from '@monkvision/types';
import { EDGE_CLIP_EPSILON, HORIZONTAL_INSET, VERTICAL_BAND_HEIGHT } from '../constants';
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
 * `originX + width` greater than the image width). Left unclamped, a vehicle that is half out of frame produces a
 * vertical fill well above its real one and a meaningless center.
 *
 * Note: Clamping is what makes the clipping flags in `getPositioningMetrics` detectable at all : an edge that was
 * outside the frame ends up exactly on it.
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
 * Computes the factor converting a normalized *vertical* extent into units of the camera's narrow field of view.
 *
 * Normalized frame coordinates divide y by the frame height, so a given physical height reads differently in portrait
 * and in landscape: rotating the device swaps which image axis maps to the narrow field of view, and the vertical
 * extent is measured against the long axis in portrait and the short one in landscape.
 *
 * The narrow field of view is a fixed property of the lens, and pixels per degree is the same on both axes for square
 * pixels, so `min(width, height)` is always the axis spanning that narrow field of view. Scaling by
 * `height / min(width, height)` therefore turns a normalized height into the fraction of the narrow field of view it
 * subtends — a quantity that depends only on the distance to the subject, never on how the phone is held.
 *
 * @param frame The intrinsic dimensions of the camera frames.
 * @return The scale factor, which is 1 in landscape and `height / width` in portrait.
 */
export function getShortAxisScaleY(frame: PixelDimensions): number {
  return frame.height / Math.min(frame.width, frame.height);
}

/**
 * Computes the guide band the vehicle's height should fill, in normalized frame coordinates.
 *
 * The band's height is fixed in narrow-field-of-view units, so in normalized coordinates it shrinks in portrait and
 * grows in landscape. That is deliberate: it makes the band the user sees mean exactly the same distance in both
 * orientations, and it makes the drawing agree with `getPositioningMetrics` by construction.
 *
 * Note: The band spans nearly the full frame width, but nothing is ever judged against its horizontal extent. It is
 * drawn open at the sides for exactly that reason.
 *
 * @param frame The intrinsic dimensions of the camera frames.
 * @return The guide band, clamped so it can never exceed the frame.
 */
export function getGuideBox(frame: PixelDimensions): CenterBox {
  return {
    xCenter: 0.5,
    yCenter: 0.5,
    width: 1 - 2 * HORIZONTAL_INSET,
    height: Math.min(1, VERTICAL_BAND_HEIGHT / getShortAxisScaleY(frame)),
  };
}

/**
 * Computes the metrics the positioning state machine runs on.
 *
 * Only the vehicle's *height* feeds the distance judgement. This is the central decision of the whole feature, and it
 * follows from what a walkaround physically is: a continuous capture at a roughly constant radius. At a constant
 * radius a vehicle's apparent length nearly triples between a head-on and a broadside view, while its height barely
 * changes — so any rule requiring the vehicle to fit inside the frame is unsatisfiable at the sides unless the user
 * stands far enough back that the head-on views resolve no damage. Height, being viewpoint-invariant, has no such
 * problem: one band covers every angle.
 *
 * "Too close" is therefore not an upper bound on size but the observation that the roof *and* the wheels have both
 * left the frame. That test is exact where a size threshold would be approximate, and it is the reason there is no
 * `verticalFill` maximum: once both edges are clipped the box necessarily spans the whole frame height anyway.
 *
 * @param box The smoothed vehicle box.
 * @param frame The intrinsic dimensions of the camera frames.
 * @return The positioning metrics.
 */
export function getPositioningMetrics(box: CenterBox, frame: PixelDimensions): PositioningMetrics {
  const corners = toCornerBox(box);
  const bandHeight = getGuideBox(frame).height;

  return {
    verticalFill: (box.height * getShortAxisScaleY(frame)) / VERTICAL_BAND_HEIGHT,
    verticalCenterError: Math.abs(box.yCenter - 0.5) / bandHeight,
    horizontalCenterError: Math.abs(box.xCenter - 0.5),
    isTopClipped: corners.y <= EDGE_CLIP_EPSILON,
    isBottomClipped: corners.y + corners.height >= 1 - EDGE_CLIP_EPSILON,
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
