import { renderHook } from '@testing-library/react-hooks';
import { useShowImageReference } from '../../src/hooks/useShowImageReference';
import { useMonkState } from '@monkvision/common';
import { ComplianceIssue, Sight, SightCategory, VehicleModel } from '@monkvision/types';
import { act } from '@testing-library/react';

const timeoutPromise = async (): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1100);
  });
};

const nonCompliantSight: Sight = {
  id: 'sight-1',
  category: SightCategory.EXTERIOR,
  label: 'Front View',
  overlay: 'front_view_overlay.png',
  tasks: [],
  vehicle: VehicleModel.ALL,
};

const compliantSight: Sight = {
  id: 'sight-2',
  category: SightCategory.EXTERIOR,
  label: 'Front View',
  overlay: 'front_view_overlay.png',
  tasks: [],
  vehicle: VehicleModel.ALL,
};

const state = {
  images: [
    { sightId: nonCompliantSight.id, id: 'id-1', complianceIssues: [ComplianceIssue.NO_VEHICLE] },
    { sightId: compliantSight.id, id: 'id-2' },
    { sightId: 'sight-3', id: 'id-3', complianceIssues: [ComplianceIssue.NO_VEHICLE] },
  ],
};

describe('useShowImageReference hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not fire unless component was synthetically mounted', async () => {
    const toggleSightTutorial = jest.fn();
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(useShowImageReference, {
      initialProps: {
        sight: nonCompliantSight,
        toggleSightTutorial,
      },
    });

    expect(result.current.hasCarCoverageComplianceIssues).toBe(true);
    expect(toggleSightTutorial.mock.calls.length).toBe(0);

    await act(timeoutPromise);

    expect(toggleSightTutorial.mock.calls.length).toBe(1);

    unmount();
  });

  it('should trigger only if the current sight has Car Coverage compliance issues', async () => {
    const toggleSightTutorial = jest.fn();
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { result, unmount, rerender } = renderHook(useShowImageReference, {
      initialProps: {
        sight: nonCompliantSight,
        toggleSightTutorial,
      },
    });

    await act(timeoutPromise);

    expect(result.current.hasCarCoverageComplianceIssues).toBe(true);
    expect(toggleSightTutorial.mock.calls.length).toBe(1);

    rerender({
      sight: compliantSight,
      toggleSightTutorial,
    });

    expect(result.current.hasCarCoverageComplianceIssues).toBe(false);
    expect(toggleSightTutorial.mock.calls.length).toBe(1);

    unmount();
  });
});
