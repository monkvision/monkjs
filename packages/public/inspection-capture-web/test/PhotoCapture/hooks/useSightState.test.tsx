import { HUDMode } from '../../../src/PhotoCapture/hook';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Sight } from '@monkvision/types';
import { AddDamagePreviewMode, useSightState } from '../../../src/PhotoCapture/hooks';

jest.mock('@monkvision/common');

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];

describe('useSightState hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the first sight as selected and an empty list of taken sights', () => {
    const { result, unmount } = renderHook(() => useSightState(sights));

    expect(result.current.selectedSight).toEqual(sights[0]);
    expect(result.current.sightsTaken).toEqual([]);
    expect(typeof result.current.handleSightTaken).toEqual('function');
    expect(typeof result.current.setSelectedSight).toEqual('function');
    unmount();
  });

  it('should update sightSelected when handleSightSelected is called', () => {
    const { result } = renderHook(() => useSightState(sights));

    const newSelectedSight = sights[1];
    act(() => {
      result.current.setSelectedSight(newSelectedSight);
    });

    expect(result.current.selectedSight).toEqual(newSelectedSight);
  });

  it('should update sightsTaken and sightSelected when handleSightTaken is called with mode is set to DEFAULT', () => {
    const { result } = renderHook(() => useSightState(sights));

    expect(result.current.sightsTaken).toEqual([]);
    expect(result.current.selectedSight).toEqual(sights[0]);
    expect(result.current.mode).toEqual(HUDMode.DEFAULT);
    expect(result.current.addDamagePreviewMode).toEqual(AddDamagePreviewMode.DEFAULT);

    act(() => {
      result.current.handleSightTaken();
    });
    expect(result.current.sightsTaken).toEqual([sights[0]]);
    expect(result.current.selectedSight).toEqual(sights[1]);

    act(() => {
      result.current.handleSightTaken();
    });

    expect(result.current.sightsTaken).toEqual([sights[0], sights[1]]);
    expect(result.current.selectedSight).toEqual(sights[1]);
  });

  it('should update damagedPictureTaken handleSightTaken is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSightState(sights));

    await act(async () => {
      result.current.setMode(HUDMode.ADD_DAMAGE);
      await waitForNextUpdate();
      result.current.handleSightTaken();
    });
    expect(result.current.addDamagePreviewMode).toEqual(AddDamagePreviewMode.CLOSEUP_PREVIEW);

    await act(async () => {
      result.current.handleSightTaken();
    });
    expect(result.current.addDamagePreviewMode).toEqual(AddDamagePreviewMode.DEFAULT);
    expect(result.current.mode).toEqual(HUDMode.DEFAULT);
  });
});
