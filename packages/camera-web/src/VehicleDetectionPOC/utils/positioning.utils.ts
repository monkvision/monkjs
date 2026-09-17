import {
  AREA_ENTER_MAX,
  AREA_ENTER_MIN,
  AREA_EXIT_MAX,
  AREA_EXIT_MIN,
  CENTER_ENTER,
  CENTER_EXIT,
  CONTAIN_ENTER,
  CONTAIN_EXIT,
  MIN_STATE_DURATION_MS,
  PERFECT_DWELL_MS,
} from '../constants';
import { PositioningMetrics, VehiclePositioningState } from '../types';

/**
 * Decides which instruction should be shown to the user, given the current geometry and the state that is currently
 * displayed.
 *
 * This function is total : every possible input maps to exactly one state. The area ratio is partitioned into
 * `(-inf, 0.4) | [0.4, 0.5) | [0.5, 0.8] | (0.8, 0.9] | (0.9, +inf)`, with the framing rule short-circuiting the
 * middle three bands and the sticky rule short-circuiting everything when the vehicle is already perfectly framed.
 *
 * The `[0.4, 0.5)` and `(0.8, 0.9]` bands left unspecified by the original design are not a gap to be filled : they
 * are exactly the shape of a hysteresis band. `[0.5, 0.8]` is the window to *become* perfectly framed and `[0.4, 0.9]`
 * the window to *remain* so, which is what keeps the frame from flickering at a boundary.
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
  const { areaRatio, centerError, overflow } = metrics;

  // Sticky PERFECT : once the vehicle is properly framed, only the WIDE exit predicates can unseat it.
  if (
    previous === VehiclePositioningState.PERFECT &&
    areaRatio >= AREA_EXIT_MIN &&
    areaRatio <= AREA_EXIT_MAX &&
    centerError <= CENTER_EXIT &&
    overflow <= CONTAIN_EXIT
  ) {
    return VehiclePositioningState.PERFECT;
  }

  // Distance dominates framing : there is no point asking someone to center a vehicle that only fills 10% of the
  // target, and doing so would make the instructions thrash between "move closer" and "center" while they walk. The
  // WIDE bounds are used here so that the hysteresis bands are never reported as a distance error.
  if (areaRatio < AREA_EXIT_MIN) {
    return VehiclePositioningState.MOVE_CLOSER;
  }
  if (areaRatio > AREA_EXIT_MAX) {
    return VehiclePositioningState.MOVE_FURTHER_AWAY;
  }

  // Roughly the right size : framing is now the actionable instruction.
  if (overflow > CONTAIN_ENTER || centerError > CENTER_ENTER) {
    return VehiclePositioningState.CENTER_THE_CAR;
  }

  // Contained and centered, inside the narrow area window.
  if (areaRatio >= AREA_ENTER_MIN && areaRatio <= AREA_ENTER_MAX) {
    return VehiclePositioningState.PERFECT;
  }

  // Contained and centered, but inside a hysteresis band without having been perfectly framed before : nudge in the
  // right direction. This is the rule that makes the function total.
  return areaRatio < AREA_ENTER_MIN
    ? VehiclePositioningState.MOVE_CLOSER
    : VehiclePositioningState.MOVE_FURTHER_AWAY;
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
