import { renderHook } from '@testing-library/react-hooks';
import { sights } from '@monkvision/sights';
import { ComplianceIssue, ComplianceOptions, Image, ImageStatus } from '@monkvision/types';
import { createEmptyMonkState, useMonkState } from '@monkvision/common';
import { useInspectionPoll } from '@monkvision/network';
import { act } from '@testing-library/react';
import { useInspectionGalleryItems } from '../../../../src/components/InspectionGallery/hooks';
import { InspectionGalleryProps } from '../../../../src';

function createProps(): InspectionGalleryProps {
  return {
    inspectionId: 'test-inspection-id-test',
    sights: [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']],
    enableCompliance: true,
    complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    apiConfig: { apiDomain: 'test-api-domain', authToken: 'test-auth-token' },
    refreshIntervalMs: 1234,
    captureMode: true,
  };
}

describe('useInspectionGalleryItems hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the gallery items using the local Monk state', () => {
    const initialProps = createProps();
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-2',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-1' },
      { isAddDamage: false, isTaken: true, image: state.images[0] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-3' },
      { isAddDamage: false, isTaken: true, image: state.images[1] },
      { isAddDamage: true },
    ]);

    unmount();
  });

  it('should properly update the items after each inspection poll', () => {
    const initialProps = createProps();
    const entities = createEmptyMonkState();
    entities.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-3',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-3',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    );
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-1' },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-2' },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-3' },
      { isAddDamage: true },
    ]);
    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
    const { onSuccess } = (useInspectionPoll as jest.Mock).mock.calls[0][0];
    act(() => onSuccess(entities));
    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: entities.images[0] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-2' },
      { isAddDamage: false, isTaken: true, image: entities.images[2] },
      { isAddDamage: false, isTaken: true, image: entities.images[1] },
      { isAddDamage: true },
    ]);

    unmount();
  });

  it('should put items to retake first in the list', () => {
    const initialProps = createProps();
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.NOT_COMPLIANT,
      } as unknown as Image,
      {
        id: 'image-3',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-3',
        status: ImageStatus.NOT_COMPLIANT,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: state.images[2] },
      { isAddDamage: false, isTaken: true, image: state.images[1] },
      { isAddDamage: false, isTaken: true, image: state.images[0] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-2' },
      { isAddDamage: true },
    ]);

    unmount();
  });

  it('should not add the add damage item if not in capture mode', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-2',
      } as unknown as Image,
      {
        id: 'image-3',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-3',
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: state.images[0] },
      { isAddDamage: false, isTaken: true, image: state.images[1] },
      { isAddDamage: false, isTaken: true, image: state.images[2] },
    ]);

    unmount();
  });

  it('should not add untaken items if not in capture mode', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([]);

    unmount();
  });

  it('should only consider the last image taken per sight in capture mode', () => {
    const initialProps = createProps();
    initialProps.captureMode = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        createdAt: Date.parse('2020-01-01T01:01:01.001Z'),
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        createdAt: Date.parse('1999-01-01T01:01:01.001Z'),
      } as unknown as Image,
      {
        id: 'image-3',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        createdAt: Date.parse('2023-01-01T01:01:01.001Z'),
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: state.images[2] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-2' },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-3' },
      { isAddDamage: true },
    ]);

    unmount();
  });

  it('should add all images image taken per sight if not in capture mode', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        createdAt: Date.parse('2020-01-01T01:01:01.001Z'),
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        createdAt: Date.parse('1999-01-01T01:01:01.001Z'),
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { result, unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: state.images[0] },
      { isAddDamage: false, isTaken: true, image: state.images[1] },
    ]);

    unmount();
  });

  it('should pass the id, apiConfig and compliance to the useInspectionPoll hook', () => {
    const initialProps = createProps();
    initialProps.captureMode = true;
    const { unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        id: initialProps.inspectionId,
        apiConfig: initialProps.apiConfig,
        compliance: {
          enableCompliance: (initialProps as Partial<ComplianceOptions>).enableCompliance,
          complianceIssues: (initialProps as Partial<ComplianceOptions>).complianceIssues,
        },
      }),
    );

    unmount();
  });

  it('should stop refreshing the inspection poll when all image statuses are done', () => {
    const initialProps = createProps();
    const { unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        delay: null,
      }),
    );

    unmount();
  });

  it('should keep refreshing the inspection poll while there are images uploading', () => {
    const initialProps = createProps();
    initialProps.refreshIntervalMs = 1234;
    const state = createEmptyMonkState();
    state.images.push({
      id: 'image-1',
      inspectionId: initialProps.inspectionId,
      status: ImageStatus.UPLOADING,
    } as unknown as Image);
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        delay: initialProps.refreshIntervalMs,
      }),
    );

    unmount();
  });

  it('should keep refreshing the inspection poll while there are images with compliance running', () => {
    const initialProps = createProps();
    initialProps.refreshIntervalMs = 1234;
    const state = createEmptyMonkState();
    state.images.push({
      id: 'image-1',
      inspectionId: initialProps.inspectionId,
      status: ImageStatus.COMPLIANCE_RUNNING,
    } as unknown as Image);
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        delay: initialProps.refreshIntervalMs,
      }),
    );

    unmount();
  });

  it('should use a default refresh interva of 1000ms if refreshIntervalMs is not provided', () => {
    const initialProps = createProps();
    initialProps.refreshIntervalMs = undefined;
    const state = createEmptyMonkState();
    state.images.push({
      id: 'image-1',
      inspectionId: initialProps.inspectionId,
      status: ImageStatus.COMPLIANCE_RUNNING,
    } as unknown as Image);
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state }));
    const { unmount } = renderHook(useInspectionGalleryItems, { initialProps });

    expect(useInspectionPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        delay: 1000,
      }),
    );

    unmount();
  });
});
