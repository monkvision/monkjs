import config from '../src/config';
import { idAttribute } from '../src/damageAreas/schema';
import { IdResponse } from '../src/sharedTypes';
import * as vehicles from '../src/vehicles';
import { CreateUpdateVehicle } from '../src/vehicles/apiTypes';
import { initAxiosConfig } from './utils/axiosConfig.utils';
import { mockAxiosRequest } from './utils/axiosMock.utils';
import { deepObjectMatcher } from './utils/matcher.utils';

jest.mock('axios');

beforeAll(() => {
  initAxiosConfig();
});

describe('vehicles', () => {
  describe('#updateOne()', () => {
    function givenParams(): {
      inspectionId: string,
      updateVehicle: CreateUpdateVehicle,
      axiosResponse: IdResponse<'id'>,
    } {
      return {
        inspectionId: 'inspectionId',
        updateVehicle: { vehicleType: 'vehicleType', brand: 'brand', color: 'color' },
        axiosResponse: { id: 'my-id' },
      };
    }

    it('should use the correct axios config', async () => {
      const { inspectionId, updateVehicle, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await vehicles.updateOne(inspectionId, updateVehicle);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        ...config.axiosConfig,
        method: 'patch',
        url: `/inspections/${inspectionId}/vehicle`,
      }));
    });

    it('should map the body keys to snake case', async () => {
      const { inspectionId, updateVehicle, axiosResponse } = givenParams();
      const { spy } = mockAxiosRequest(axiosResponse);

      await vehicles.updateOne(inspectionId, updateVehicle);

      expect(spy).toHaveBeenCalledWith(deepObjectMatcher({
        data: { vehicle_type: updateVehicle.vehicleType, brand: updateVehicle.brand, color: updateVehicle.color },
      }));
    });

    it('should return a correct corejs response with a normalized vehicle entity', async () => {
      const { inspectionId, updateVehicle, axiosResponse } = givenParams();
      const { response } = mockAxiosRequest(axiosResponse);

      const corejsResponse = await vehicles.updateOne(inspectionId, updateVehicle);

      expect(corejsResponse.axiosResponse).toEqual(deepObjectMatcher(response));
      expect(corejsResponse[idAttribute]).toEqual(axiosResponse.id);
      expect(corejsResponse.entities).toEqual(deepObjectMatcher({
        vehicles: {
          [axiosResponse.id]: {
            [idAttribute]: axiosResponse.id,
            vehicleType: updateVehicle.vehicleType,
            brand: updateVehicle.brand,
            color: updateVehicle.color,
          },
        },
      }));
      expect(corejsResponse.result).toEqual(axiosResponse.id);
    });
  });
});
