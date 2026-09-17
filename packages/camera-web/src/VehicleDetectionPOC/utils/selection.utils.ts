import { Detection } from '@mediapipe/tasks-vision';
import { PixelDimensions } from '@monkvision/types';
import {
  MIN_DETECTION_SCORE,
  SCORE_TIEBREAK_WEIGHT,
  TRACK_IOU_MIN,
  VEHICLE_CATEGORY_NAMES,
} from '../constants';
import { CenterBox, VehicleDetection } from '../types';
import { getIou, normalizeBoundingBox } from './geometry.utils';

/**
 * Keeps only the detections that are a vehicle detected with enough confidence, and converts them to normalized frame
 * coordinates.
 *
 * Note: The score threshold and the category allowlist are also passed to MediaPipe so that the native side does the
 * filtering. They are re-applied here because this is where the thresholds are documented, and because the debug
 * overlay needs the filtered list anyway.
 *
 * @param detections The raw detections returned by the object detector.
 * @param source The dimensions of the image that was given to the detector.
 * @return The vehicle candidates, in normalized frame coordinates.
 */
export function getVehicleCandidates(
  detections: Detection[],
  source: PixelDimensions,
): VehicleDetection[] {
  return detections.reduce<VehicleDetection[]>((candidates, detection) => {
    const category = detection.categories.find(
      ({ categoryName, score }) =>
        score > MIN_DETECTION_SCORE && VEHICLE_CATEGORY_NAMES.includes(categoryName),
    );
    const box = detection.boundingBox ? normalizeBoundingBox(detection.boundingBox, source) : null;

    if (category && box) {
      candidates.push({ box, score: category.score, categoryName: category.categoryName });
    }
    return candidates;
  }, []);
}

/**
 * The outcome of picking which candidate is the vehicle the user is framing.
 */
export interface VehicleSelection {
  /**
   * The selected candidate.
   */
  detection: VehicleDetection;
  /**
   * Whether this is a newly acquired track rather than a continuation of the previous one.
   */
  isNewTrack: boolean;
}

/**
 * Returns the candidate with the highest score according to the given scoring function.
 *
 * @param candidates The candidates to choose from.
 * @param getScore The scoring function.
 * @return The best candidate, or null if there is none.
 */
function getBestCandidate(
  candidates: VehicleDetection[],
  getScore: (candidate: VehicleDetection) => number,
): VehicleDetection | null {
  return candidates.reduce<VehicleDetection | null>((best, candidate) => {
    if (!best || getScore(candidate) > getScore(best)) {
      return candidate;
    }
    return best;
  }, null);
}

/**
 * Picks which of the candidates is the vehicle the user is framing.
 *
 * The highest scoring candidate is deliberately *not* used : confidence correlates with how canonical a view of a car
 * the model is looking at, not with which car the user cares about, so it flips between the subject and a parked car
 * in the background. Picking the largest box is wrong for the same kind of reason (a vehicle passing in the
 * foreground wins). Instead:
 *
 * - While a track exists, the candidate overlapping it the most wins. This temporal continuity is what stops the
 *   smoothing from interpolating between two different vehicles.
 * - When acquiring, the candidate overlapping the *target frame* the most wins, since that single scalar already
 *   encodes both "big" and "centered". The score only breaks ties.
 *
 * @param candidates The vehicle candidates of the current tick.
 * @param tracked The box currently being tracked, or null if there is no track.
 * @param target The static target frame.
 * @return The selected vehicle, or null if there is no candidate.
 */
export function selectVehicleDetection(
  candidates: VehicleDetection[],
  tracked: CenterBox | null,
  target: CenterBox,
): VehicleSelection | null {
  if (candidates.length === 0) {
    return null;
  }
  if (tracked) {
    const continued = getBestCandidate(candidates, ({ box }) => getIou(box, tracked));
    if (continued && getIou(continued.box, tracked) >= TRACK_IOU_MIN) {
      return { detection: continued, isNewTrack: false };
    }
  }
  const acquired = getBestCandidate(
    candidates,
    ({ box, score }) => getIou(box, target) + score * SCORE_TIEBREAK_WEIGHT,
  );
  return acquired ? { detection: acquired, isNewTrack: true } : null;
}
