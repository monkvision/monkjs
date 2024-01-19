import ky, { ResponsePromise } from 'ky';
import { mapGetInspectionResponse } from '../../../../src/api/requests/inspections/mappers';
import { getKyConfig, MonkAPIConfig } from '../../../../src/api/config';
import { getInspection } from '../../../../src/api/requests/inspections';

jest.mock('../../../../src/api/config', () => ({
  getKyConfig: jest.fn(() => ({ baseUrl: 'test', headers: { test: 'hello' } })),
}));
jest.mock('../../../../src/api/requests/inspections/mappers', () => ({
  mapGetInspectionResponse: jest.fn(() => ({ inspections: [{ id: 'test' }] })),
}));

describe('Inspection requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInspection function', () => {
    it('should pass the proper params to the ky request', async () => {
      const id = 'inspection-id-test';
      const config: MonkAPIConfig = { apiDomain: 'test', authToken: 'wow' };
      await getInspection(id, config);

      expect(getKyConfig).toHaveBeenCalledWith(config);
      expect(ky.get).toHaveBeenCalledWith(
        `${getKyConfig({} as MonkAPIConfig).baseUrl}/inspections/${id}`,
        { headers: getKyConfig(config).headers },
      );
    });

    it('should return the ky response', async () => {
      const status = 404;
      jest.spyOn(ky, 'get').mockImplementationOnce(
        () =>
          Promise.resolve({
            status,
            json: () => Promise.resolve({}),
          }) as ResponsePromise,
      );
      const result = await getInspection('test', {} as MonkAPIConfig);
      expect(result.response).toEqual(expect.objectContaining({ status }));
    });

    it('should return the response body', async () => {
      const body = { hello: 'world' };
      jest.spyOn(ky, 'get').mockImplementationOnce(
        () =>
          Promise.resolve({
            json: () => Promise.resolve(body),
          }) as ResponsePromise,
      );
      const result = await getInspection('test', {} as MonkAPIConfig);
      expect(result.body).toEqual(body);
    });

    it('should return the mapped entities', async () => {
      const result = await getInspection('test', {} as MonkAPIConfig);
      expect(result.payload).toEqual({ entities: (mapGetInspectionResponse as jest.Mock)() });
    });
  });
});
