jest.mock('axios', () => ({
  request: jest.fn(() => Promise.resolve({ data: { test: 'hello' } })),
}));
jest.mock('../../../../src/api/config', () => ({
  getBaseAxiosConfig: jest.fn(() => ({ baseUrl: 'test' })),
}));
jest.mock('../../../../src/api/requests/inspections/mappers', () => ({
  mapGetInspectionResponse: jest.fn(() => ({ inspections: [{ id: 'test' }] })),
}));

import axios from 'axios';
import { mapGetInspectionResponse } from '../../../../src/api/requests/inspections/mappers';
import { getBaseAxiosConfig, MonkAPIConfig } from '../../../../src/api/config';
import { getInspection } from '../../../../src/api/requests/inspections';

describe('Inspection requests', () => {
  describe('getInspection function', () => {
    it('should pass the proper params to the axios request', async () => {
      const id = 'inspection-id-test';
      const config: MonkAPIConfig = { apiDomain: 'test', authToken: 'wow' };
      await getInspection(id, config);

      expect(getBaseAxiosConfig).toHaveBeenCalledWith(config);
      expect(axios.request).toHaveBeenCalledWith({
        ...getBaseAxiosConfig(config),
        method: 'get',
        url: `/inspections/${id}`,
      });
    });

    it('should return the axiosResponse', async () => {
      const result = await getInspection('test', {} as MonkAPIConfig);
      expect(result.axiosResponse).toEqual(await (axios.request as jest.Mock)());
    });

    it('should return the mapped entities', async () => {
      const result = await getInspection('test', {} as MonkAPIConfig);
      expect(result.payload).toEqual({ entities: (mapGetInspectionResponse as jest.Mock)() });
    });
  });
});
