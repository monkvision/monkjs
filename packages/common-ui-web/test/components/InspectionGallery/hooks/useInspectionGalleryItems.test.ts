import { renderHook } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import {
  ComplianceIssue,
  ComplianceOptions,
  Image,
  ImageStatus,
  Inspection,
  Viewpoint,
} from '@monkvision/types';
import { createEmptyMonkState, useMonkState } from '@monkvision/common';
import { useInspectionPoll } from '@monkvision/network';
import { useInspectionGalleryItems } from '../../../../src/components/InspectionGallery/hooks';
import { InspectionGalleryProps } from '../../../../src';

function createProps(): InspectionGalleryProps {
  return {
    inspectionId: 'test-inspection-id-test',
    sights: [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']],
    enableCompliance: true,
    complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
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
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    const entitiesMock1 = createEmptyMonkState();
    entitiesMock1.images.push({
      id: 'image-1',
      sightId: 'test-sight-1',
      inspectionId: initialProps.inspectionId,
      status: ImageStatus.SUCCESS,
    } as unknown as Image);

    const entitiesMock2 = createEmptyMonkState();
    entitiesMock2.images.push(
      {
        id: 'image-1',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'image-2',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-2',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state: entitiesMock1 }));
    const { result, unmount, rerender } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: entitiesMock1.images[0] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-2' },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-3' },
      { isAddDamage: true },
    ]);

    (useMonkState as jest.Mock).mockImplementation(() => ({ state: entitiesMock2 }));
    rerender(initialProps);
    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: entitiesMock2.images[0] },
      { isAddDamage: false, isTaken: true, image: entitiesMock2.images[1] },
      { isAddDamage: false, isTaken: false, sightId: 'test-sight-3' },
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
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    (useMonkState as jest.Mock).mockImplementationOnce(() => ({ state: createEmptyMonkState() }));
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    const { result, unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

    expect(result.current).toEqual([
      { isAddDamage: false, isTaken: true, image: state.images[0] },
      { isAddDamage: false, isTaken: true, image: state.images[1] },
    ]);

    unmount();
  });

  it('should pass the id, apiConfig and compliance to the useInspectionPoll hook', () => {
    const initialProps = createProps();
    initialProps.captureMode = true;
    const { unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    const { unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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
    const { unmount } = renderHook((props: InspectionGalleryProps) => useInspectionGalleryItems(props), { initialProps });

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

  it('should sort video frames after non-video items', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'frame-1',
        inspectionId: initialProps.inspectionId,
        additionalData: { frame_index: 0 },
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'sight-image',
        inspectionId: initialProps.inspectionId,
        sightId: 'test-sight-1',
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'frame-2',
        inspectionId: initialProps.inspectionId,
        additionalData: { frame_index: 1 },
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const ids = result.current.map((item) =>
      !item.isAddDamage && item.isTaken ? item.image.id : null,
    );
    expect(ids.indexOf('sight-image')).toBeLessThan(ids.indexOf('frame-1'));
    expect(ids.indexOf('sight-image')).toBeLessThan(ids.indexOf('frame-2'));

    unmount();
  });

  it('should sort video frames by frame_index', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'frame-c',
        inspectionId: initialProps.inspectionId,
        additionalData: { frame_index: 10 },
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'frame-a',
        inspectionId: initialProps.inspectionId,
        additionalData: { frame_index: 2 },
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
      {
        id: 'frame-b',
        inspectionId: initialProps.inspectionId,
        additionalData: { frame_index: 5 },
        status: ImageStatus.SUCCESS,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const ids = result.current
      .filter((item) => !item.isAddDamage && item.isTaken)
      .map((item) => (!item.isAddDamage && item.isTaken ? item.image.id : null));
    expect(ids).toEqual(['frame-a', 'frame-b', 'frame-c']);

    unmount();
  });

  it('should prepend beauty shot items when enableBeautyShotExtraction is true', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'img-front-1',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.9 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
      {
        id: 'img-front-2',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.5 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const beautyItems = result.current.filter(
      (item) => !item.isAddDamage && item.isTaken && item.beautyShotCandidates,
    );
    expect(beautyItems.length).toBeGreaterThan(0);
    const firstBeauty = beautyItems[0];
    expect(firstBeauty).toMatchObject({
      isTaken: true,
      isAddDamage: false,
    });
    expect(
      !firstBeauty.isAddDamage && firstBeauty.isTaken && firstBeauty.beautyShotCandidates,
    ).toBeTruthy();

    // Beauty shot items should appear before regular items
    const firstBeautyIdx = result.current.indexOf(firstBeauty);
    const regularItems = result.current.filter(
      (item) => !item.isAddDamage && item.isTaken && !item.beautyShotCandidates,
    );
    if (regularItems.length > 0) {
      const firstRegularIdx = result.current.indexOf(regularItems[0]);
      expect(firstBeautyIdx).toBeLessThan(firstRegularIdx);
    }

    unmount();
  });

  it('should prefer explicitly selected beauty shot images', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.inspections.push({
      id: initialProps.inspectionId,
      additionalData: {
        beauty_shots: { [Viewpoint.FRONT]: 'explicit-img' },
      },
    } as unknown as Inspection);
    state.images.push(
      {
        id: 'explicit-img',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.3 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
      {
        id: 'high-conf-img',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.95 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const frontBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.FRONT,
    );
    expect(frontBeauty).toBeDefined();
    expect(!frontBeauty!.isAddDamage && frontBeauty!.isTaken && frontBeauty!.image.id).toBe(
      'explicit-img',
    );

    unmount();
  });

  it('should prefer isVehicleFullyInFrame when no explicit beauty shot is set', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'not-full-frame',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.95 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
      {
        id: 'full-frame',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.8 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
      {
        id: 'also-not-full',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.7 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const frontBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.FRONT,
    );
    expect(frontBeauty).toBeDefined();
    expect(!frontBeauty!.isAddDamage && frontBeauty!.isTaken && frontBeauty!.image.id).toBe(
      'full-frame',
    );

    unmount();
  });

  it('should handle multiple viewpoints and create beauty shots for each', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'img-front',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.9 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
      {
        id: 'img-back',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.BACK]: 0.85 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const frontBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.FRONT,
    );
    const backBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.BACK,
    );
    expect(frontBeauty).toBeDefined();
    expect(backBeauty).toBeDefined();

    unmount();
  });

  it('should not create a beauty shot for a viewpoint with no matching images', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push({
      id: 'img-front-only',
      inspectionId: initialProps.inspectionId,
      status: ImageStatus.SUCCESS,
      viewpointConfidences: { [Viewpoint.FRONT]: 0.9 },
      isVehicleFullyInFrame: true,
    } as unknown as Image);
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const backBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.BACK,
    );
    expect(backBeauty).toBeUndefined();

    unmount();
  });

  it('should fallback to highest confidence image when no image has isVehicleFullyInFrame', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'low-conf',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.4 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
      {
        id: 'high-conf',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.9 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const frontBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.FRONT,
    );
    expect(frontBeauty).toBeDefined();
    expect(!frontBeauty!.isAddDamage && frontBeauty!.isTaken && frontBeauty!.image.id).toBe(
      'high-conf',
    );

    unmount();
  });

  it('should exclude the selected beauty shot image from candidates', () => {
    const initialProps = createProps();
    initialProps.captureMode = false;
    (initialProps as any).enableBeautyShotExtraction = true;
    const state = createEmptyMonkState();
    state.images.push(
      {
        id: 'best-img',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.95 },
        isVehicleFullyInFrame: true,
      } as unknown as Image,
      {
        id: 'other-img',
        inspectionId: initialProps.inspectionId,
        status: ImageStatus.SUCCESS,
        viewpointConfidences: { [Viewpoint.FRONT]: 0.5 },
        isVehicleFullyInFrame: false,
      } as unknown as Image,
    );
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
    const { result, unmount } = renderHook(
      (props: InspectionGalleryProps) => useInspectionGalleryItems(props),
      { initialProps },
    );

    const frontBeauty = result.current.find(
      (item) =>
        !item.isAddDamage &&
        item.isTaken &&
        item.beautyShotCandidates?.view === Viewpoint.FRONT,
    );
    expect(frontBeauty).toBeDefined();
    const candidates = !frontBeauty!.isAddDamage && frontBeauty!.isTaken
      ? frontBeauty!.beautyShotCandidates!.candidates
      : [];
    const selectedId = !frontBeauty!.isAddDamage && frontBeauty!.isTaken
      ? frontBeauty!.image.id
      : undefined;
    expect(candidates.find((c) => c.id === selectedId)).toBeUndefined();

    unmount();
  });
});
