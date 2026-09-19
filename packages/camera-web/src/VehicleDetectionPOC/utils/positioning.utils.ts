import {
  HORIZONTAL_CENTER_ENTER,
  HORIZONTAL_CENTER_EXIT,
  MIN_STATE_DURATION_MS,
  PERFECT_DWELL_MS,
  VERTICAL_CENTER_ENTER,
  VERTICAL_CENTER_EXIT,
  VERTICAL_FILL_ENTER_MIN,
  VERTICAL_FILL_EXIT_MIN,
} from '../constants';
import { PositioningMetrics, VehiclePositioningState } from '../types';

/**
 * Decides which instruction should be shown to the user, given the current geometry and the state that is currently
 * displayed.
 *
 * This function is total : every possible input maps to exactly one state. Only the vehicle's height and position are
 * consulted, never its width — see `getPositioningMetrics` for why a walkaround cannot require the vehicle to fit
 * inside the frame.
 *
 * The vertical fill is partitioned into `(-inf, 0.42) | [0.42, 0.5) | [0.5, +inf)`. The middle band is not a gap to
 * be filled : it is exactly the shape of a hysteresis band. `0.5` is the threshold to *become* well framed and `0.42`
 * the one to *remain* so, which is what keeps the state from flickering at the boundary.
 *
 * @param metrics The current positioning metrics, or null if no vehicle is tracked. The caller is expected to have
 * already applied the detection loss grace period.
 * @param previous The state that is currently displayed, which drives the hysteresis.
 * @return The state that should be displayed.
 */
export function decideVehiclePositioningState(
  metrics: PositioningMetrics | null,
  previous: VehiclePositioningState,
): VehiclePositioningState {
  if (!metrics) {
    return VehiclePositioningState.NO_CAR_DETECTED;
  }
  const {
    verticalFill,
    verticalCenterError,
    horizontalCenterError,
    isTopClipped,
    isBottomClipped,
  } = metrics;
  // The exact "too close" signal : the roof and the wheels have both left the frame, so no amount of panning will
  // bring the full height of the vehicle back into view. Checked before everything else because it is the one error
  // the user cannot fix by aiming, and because a size threshold cannot tell it apart from a legitimately large
  // broadside view.
  const isTooClose = isTopClipped && isBottomClipped;

  // Sticky PERFECT : once the framing is good, only the WIDE exit predicates can unseat it.
  if (
    previous === VehiclePositioningState.PERFECT &&
    !isTooClose &&
    verticalFill >= VERTICAL_FILL_EXIT_MIN &&
    verticalCenterError <= VERTICAL_CENTER_EXIT &&
    horizontalCenterError <= HORIZONTAL_CENTER_EXIT
  ) {
    return VehiclePositioningState.PERFECT;
  }

  if (isTooClose) {
    return VehiclePositioningState.MOVE_FURTHER_AWAY;
  }

  // Distance dominates aim : there is no point asking someone to center a vehicle that fills a tenth of the band, and
  // doing so would make the instructions thrash between "move closer" and "center" while they walk. The WIDE bound is
  // used here so that the hysteresis band is never reported as a distance error.
  if (verticalFill < VERTICAL_FILL_EXIT_MIN) {
    return VehiclePositioningState.MOVE_CLOSER;
  }

  // Roughly the right distance : aim is now the actionable instruction.
  if (
    verticalCenterError > VERTICAL_CENTER_ENTER ||
    horizontalCenterError > HORIZONTAL_CENTER_ENTER
  ) {
    return VehiclePositioningState.CENTER_THE_CAR;
  }

  // On target, and the vehicle's full height fills the band.
  if (verticalFill >= VERTICAL_FILL_ENTER_MIN) {
    return VehiclePositioningState.PERFECT;
  }

  // On target, but inside the hysteresis band without having been well framed before : nudge in the right direction.
  // This is the rule that makes the function total.
  return VehiclePositioningState.MOVE_CLOSER;
}

/**
 * The mutable bookkeeping used by `commitState` to debounce the output of the state machine.
 */
export interface StateCommit {
  /**
   * The state currently being displayed.
   */
  committed: VehiclePositioningState;
  /**
   * The state that is waiting to be committed.
   */
  candidate: VehiclePositioningState;
  /**
   * The timestamp, in milliseconds, at which the candidate first appeared.
   */
  candidateSince: number;
}

/**
 * Creates the initial bookkeeping for `commitState`.
 *
 * @param now The current timestamp, in milliseconds.
 * @return A fresh state commit, starting from `VehiclePositioningState.NO_CAR_DETECTED`.
 */
export function createStateCommit(now: number): StateCommit {
  return {
    committed: VehiclePositioningState.NO_CAR_DETECTED,
    candidate: VehiclePositioningState.NO_CAR_DETECTED,
    candidateSince: now,
  };
}

/**
 * How long a proposed state must hold continuously before it is committed.
 *
 * Becoming perfectly framed requires a deliberate hold, because that is what triggers the success feedback. Losing
 * the vehicle commits immediately, because it has already been gated by the detection loss grace period.
 *
 * @param state The proposed state.
 * @return The required dwell time, in milliseconds.
 */
function getRequiredDwellMs(state: VehiclePositioningState): number {
  if (state === VehiclePositioningState.PERFECT) {
    return PERFECT_DWELL_MS;
  }
  if (state === VehiclePositioningState.NO_CAR_DETECTED) {
    return 0;
  }
  return MIN_STATE_DURATION_MS;
}

/**
 * Debounces the output of the state machine in the time domain.
 *
 * The hysteresis in `decideVehiclePositioningState` prevents oscillation *across* a threshold, but close to one the
 * smoothed geometry still wanders, and a brand new state can legitimately appear for a single tick. This is the third
 * and last smoothing layer : the EMA smooths the geometry, the hysteresis widens the boundaries, and this debounces
 * the discrete output.
 *
 * @param commit The bookkeeping of the previous tick.
 * @param proposed The state proposed by `decideVehiclePositioningState`.
 * @param now The current timestamp, in milliseconds.
 * @return The updated bookkeeping, whose `committed` field is the state that should actually be displayed.
 */
export function commitState(
  commit: StateCommit,
  proposed: VehiclePositioningState,
  now: number,
): StateCommit {
  if (proposed === commit.committed) {
    return { committed: commit.committed, candidate: proposed, candidateSince: now };
  }
  const candidateSince = proposed === commit.candidate ? commit.candidateSince : now;
  const hasDwelled = now - candidateSince >= getRequiredDwellMs(proposed);

  return {
    committed: hasDwelled ? proposed : commit.committed,
    candidate: proposed,
    candidateSince,
  };
}
