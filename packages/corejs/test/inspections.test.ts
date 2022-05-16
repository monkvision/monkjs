import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import * as inspections from '../src/inspections';
import {
  CreateInspection,
  GetManyInspectionsOptions,
  GetOneInspectionOptions,
  InspectionSummary,
} from '../src/inspections/apiTypes';
import { Inspection, InspectionStatus, PdfInputData } from '../src/inspections/entityTypes';
import {
  IdResponse,
  OwnershipFilter,
  PaginatedResponse,
  PaginationOrder,
  ProgressStatus,
  ProgressStatusUpdate,
} from '../src/sharedTypes';
import { TaskName } from '../src/tasks/entityTypes';
import { WheelType } from '../src/wheelAnalysis/entityTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';
import { createMockPaging } from './utils/mockPaging';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('inspections', () => {
  describe('#getOne()', () => {
    function givenParams(): { id: string, options: GetOneInspectionOptions, inspection: Inspection } {
      const id = 'my-id';
      return {
        id,
        options: { showDeletedObjects: true },
        inspection: {
          id,
          images: [{ id: 'imageId', path: 'path', mimetype: 'application/png', views: [] }],
          wheelAnalysis: [],
          documents: [],
          severityResults: [],
          tasks: [],
          damages: [],
          parts: [],
        },
      };
    }

    it('should use the correct axios config', async () => {
      const { id, options, inspection } = givenParams();
      const { spy } = mockAxiosRequest(inspection);

      await inspections.getOne(id, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: `/inspections/${id}`,
      }));
    });

    it('should map the param keys to snake case', async () => {
      const { id, options, inspection } = givenParams();
      const { spy } = mockAxiosRequest(inspection);

      await inspections.getOne(id, options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        params: { show_deleted_objects: options.showDeletedObjects },
      }));
    });

    it('should return a correct corejs response with a normalized inspection entity and its relations', async () => {
      const { id, options, inspection } = givenParams();
      const { response } = mockAxiosRequest(inspection);

      const corejsResponse = await inspections.getOne(id, options);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [id]: { ...inspection, images: [inspection.images[0].id] },
        },
        images: {
          [inspection.images[0].id]: inspection.images[0],
        },
      }));
      expect(corejsResponse.result).toEqual(id);
    });

    it('should pull the wheel analysis from images if it is not provided', async () => {
      const { id, options, inspection } = givenParams();
      inspection.wheelAnalysis = undefined;
      inspection.images = [
        {
          id: 'image1',
          path: 'path',
          mimetype: 'application/png',
          views: [],
          wheelAnalsis: { id: 'wa-id1' },
        },
        {
          id: 'image2',
          path: 'path',
          mimetype: 'application/png',
          views: [],
          viewpoint: { confidence: 1, prediction: 'back_right' },
          wheelAnalsis: { id: 'wa-id2' },
        },
        {
          id: 'image3',
          path: 'path',
          mimetype: 'application/png',
          views: [],
          wheelAnalsis: {
            id: 'wa-id3',
            wheelName: WheelType.WHEEL_FRONT_LEFT,
          },
        },
      ];
      inspection.tasks = [{
        id: 'task-id',
        name: TaskName.WHEEL_ANALYSIS,
        status: ProgressStatus.TODO,
        images: [
          {
            imageId: 'image1',
            details: { wheelName: WheelType.WHEEL_BACK_LEFT },
          },
          { imageId: 'image2' },
          { imageId: 'image3' },
        ],
      }];
      const expectedWheelAnalysis = [
        { id: 'wa-id1', wheelName: WheelType.WHEEL_BACK_LEFT, imageId: 'image1' },
        { id: 'wa-id2', wheelName: WheelType.WHEEL_BACK_RIGHT, imageId: 'image2' },
        { id: 'wa-id3', wheelName: WheelType.WHEEL_FRONT_LEFT, imageId: 'image3' },
      ];
      mockAxiosRequest(inspection);

      const corejsResponse = await inspections.getOne(id, options);

      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [id]: {
            ...inspection,
            images: inspection.images.map((image) => image.id),
            tasks: inspection.tasks.map((task) => task.id),
            wheelAnalysis: expectedWheelAnalysis.map((wa) => wa.id),
          },
        },
        tasks: {
          [inspection.tasks[0].id]: inspection.tasks[0],
        },
        images: {
          [inspection.images[0].id]: inspection.images[0],
          [inspection.images[1].id]: inspection.images[1],
          [inspection.images[2].id]: inspection.images[2],
        },
        wheelAnalysis: {
          [expectedWheelAnalysis[0].id]: expectedWheelAnalysis[0],
          [expectedWheelAnalysis[1].id]: expectedWheelAnalysis[1],
          [expectedWheelAnalysis[2].id]: expectedWheelAnalysis[2],
        },
      }));
    });
  });

  describe('#getMany()', () => {
    function givenParams(): {
      options: GetManyInspectionsOptions,
      axiosResponse: PaginatedResponse<InspectionSummary>,
    } {
      return {
        options: {
          showDeleted: false,
          ownershipFilter: OwnershipFilter.OWN_RESOURCES,
          inspectionStatus: InspectionStatus.DONE,
          verbose: 0,
          paginationOrder: PaginationOrder.ASC,
        },
        axiosResponse: {
          paging: createMockPaging(),
          data: [
            {
              id: 'id1',
              ownerId: '1',
              images: [{ id: 'imageId1', mimetype: 'application/png', path: 'path', views: [] }],
            },
            {
              id: 'id2',
              ownerId: '2',
              images: [{ id: 'imageId1', mimetype: 'application/png', path: 'path', views: [] }],
            },
          ],
        },
      };
    }

    it('should use the correct axios config', async () => {
      const { options, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.getMany(options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'get',
        url: '/inspections',
      }));
    });

    it('should map the param keys to snake case', async () => {
      const { options, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.getMany(options);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        params: {
          show_deleted: options.showDeleted,
          ownership_filter: options.ownershipFilter,
          inspection_status: options.inspectionStatus,
          verbose: options.verbose,
          pagination_order: options.paginationOrder,
        },
      }));
    });

    it('should return a correct corejs response with a normalized list of inspection entities', async () => {
      const { options, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await inspections.getMany(options);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [axiosResponse.data[0].id]: {
            ...axiosResponse.data[0],
            images: axiosResponse.data[0].images.map((image) => image.id),
          },
          [axiosResponse.data[1].id]: {
            ...axiosResponse.data[1],
            images: axiosResponse.data[1].images.map((image) => image.id),
          },
        },
        images: {
          [axiosResponse.data[0].images[0].id]: axiosResponse.data[0].images[0],
          [axiosResponse.data[1].images[0].id]: axiosResponse.data[1].images[0],
        },
      }));
      expect(corejsResponse.result).toEqual(deepObjectMatcher(axiosResponse.data.map((inspection) => inspection.id)));
    });
  });

  describe('#createOne()', () => {
    function givenParams(): { createInspection: CreateInspection, axiosResponse: IdResponse<'id'> } {
      return {
        createInspection: {
          tasks: {
            wheelAnalysis: { status: ProgressStatusUpdate.TODO },
            imagesOcr: { status: ProgressStatusUpdate.TODO },
          },
          vehicle: { brand: 'brand', color: 'color', vehicleType: 'vehicleType' },
        },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { createInspection, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.createOne(createInspection);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'post',
        url: '/inspections',
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { createInspection, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.createOne(createInspection);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: {
          tasks: {
            wheel_analysis: createInspection.tasks.wheelAnalysis,
            images_ocr: createInspection.tasks.imagesOcr,
          },
          vehicle: {
            brand: createInspection.vehicle.brand,
            color: createInspection.vehicle.color,
            vehicle_type: createInspection.vehicle.vehicleType,
          },
        },
      }));
    });

    it('should return a correct corejs response with a normalized inspection entity', async () => {
      const { createInspection, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await inspections.createOne(createInspection);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [axiosResponse.id]: {
            id: axiosResponse.id,
            inspectionType: createInspection.inspectionType,
            accidentNature: createInspection.accidentNature,
            relatedInspectionId: createInspection.relatedInspectionId,
            additionalData: createInspection.additionalData,
            usageDuration: createInspection.usageDuration,
            createdAt: expect.any(String) as unknown,
          },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });

  describe('#addAdditionalDataToOne()', () => {
    function givenParams(): { id: string, data: PdfInputData, axiosResponse: IdResponse<'id'> } {
      const id = 'my-id';
      return {
        id,
        data: { agentCompany: 'agentCompany', agentCompanyCity: 'agentCompanyCity' },
        axiosResponse: { id },
      };
    }

    it('should use the correct axios config', async () => {
      const { data, id, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.addAdditionalDataToOne(id, data);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'patch',
        url: `/inspections/${id}/pdf_data`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { data, id, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.addAdditionalDataToOne(id, data);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: { agent_company: data.agentCompany, agent_company_city: data.agentCompanyCity },
      }));
    });

    it('should return a correct corejs response with a normalized inspection entity', async () => {
      const { data, id, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await inspections.addAdditionalDataToOne(id, data);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [id]: {
            id,
            additionalData: { pdfData: data },
          },
        },
      }));
      expect(corejsResponse.result).toEqual(id);
    });
  });

  describe('#deleteOne()', () => {
    function givenParams(): { id: string, axiosResponse: IdResponse<'id'> } {
      const id = 'my-id';
      return {
        id,
        axiosResponse: { id },
      };
    }

    it('should use the correct axios config', async () => {
      const { id, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await inspections.deleteOne(id);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'delete',
        url: `/inspections/${id}`,
      }));
    });

    it('should return a correct corejs response', async () => {
      const { id, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await inspections.deleteOne(id);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        inspections: {
          [id]: { id },
        },
      }));
      expect(corejsResponse.result).toEqual(id);
    });
  });
});
