import {
  EDGE_GAP_ENTER,
  EDGE_GAP_EXIT,
  HORIZONTAL_CENTER_ENTER,
  HORIZONTAL_CENTER_EXIT,
  MIN_STATE_DURATION_MS,
  PERFECT_DWELL_MS,
} from '../constants';
import { PositioningMetrics, VehiclePositioningState } from '../types';

/**
 * Decides which instruction should be shown to the user, given the current geometry and the state that is currently
 * displayed.
 *
 * This function is total : every possible input maps to exactly one state. Only the vehicle's vertical extent and
 * position are consulted, never its width — see `getPositioningMetrics` for why a walkaround cannot require the
 * vehicle to fit inside the frame.
 *
 * The worst edge gap is partitioned into `[0, 0.1] | (0.1, 0.16] | (0.16, +inf)`. The middle band is not a gap to be
 * filled : it is exactly the shape of a hysteresis band. `0.1` is the threshold to *become* well framed and `0.16`
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
  const { topGap, bottomGap, horizontalCenterError, isTopClipped, isBottomClipped } = metrics;
  // The two gaps answer different questions, and the distinction is what makes the instructions useful. Room on
  // *both* sides means the vehicle is small inside the band, so it is simply too far away. Room on only *one* side
  // means the camera is tilted, or the box is a part of the vehicle rather than the whole of it.
  const worstGap = Math.max(topGap, bottomGap);
  const bestGap = Math.min(topGap, bottomGap);
  // The "too close" signal : an edge has left the frame and *neither* edge still has room, so the vehicle is taller
  // than the frame and no amount of aiming will bring its full height back into view.
  //
  // Both halves are needed. Requiring both edges to be clipped misses the vehicle that overruns the top while its
  // bottom sits past the lower line — also too close, but only one edge reports it. Requiring merely one clipped
  // edge would instead punish a camera tilted down at a vehicle that does fit, which is an aiming error and is
  // handled below. Checked before the gaps because a clipped edge reads as no gap at all, which would otherwise look
  // like an ideal framing.
  const isTooClose = (isTopClipped || isBottomClipped) && worstGap <= 0;

  // Sticky PERFECT : once the framing is good, only the WIDE exit predicates can unseat it.
  if (
    previous === VehiclePositioningState.PERFECT &&
    !isTooClose &&
    worstGap <= EDGE_GAP_EXIT &&
    horizontalCenterError <= HORIZONTAL_CENTER_EXIT
  ) {
    return VehiclePositioningState.PERFECT;
  }

  if (isTooClose) {
    return VehiclePositioningState.MOVE_FURTHER_AWAY;
  }

  // Aiming at the wrong thing entirely dominates everything else : there is no point discussing distance while the
  // camera is pointed past the vehicle.
  if (horizontalCenterError > HORIZONTAL_CENTER_ENTER) {
    return VehiclePositioningState.CENTER_THE_CAR;
  }

  // Too far. The WIDE bound is used here so that losing a good framing by stepping back reports a distance error
  // immediately, rather than leaving a dead zone between the two tests.
  if (bestGap > EDGE_GAP_EXIT) {
    return VehiclePositioningState.MOVE_CLOSER;
  }

  // One edge short of its line : the camera is tilted, or this is a part of the vehicle and not the whole of it.
  // Those two are geometrically indistinguishable from a bounding box, so the instruction deliberately states the
  // goal instead of guessing a direction to move in.
  if (worstGap > EDGE_GAP_ENTER) {
    return VehiclePositioningState.CENTER_THE_CAR;
  }

  return VehiclePositioningState.PERFECT;
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
