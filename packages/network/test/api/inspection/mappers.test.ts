import data from './apiInspectionGet.data.json';
import apiInspectionGetParsed from './apiInspectionGet.data';
import { ApiInspectionGet } from '../../../src/api/models';
import { mapApiInspectionGet } from '../../../src/api/inspection/mappers';

describe('Inspection API Mappers', () => {
  describe('ApiInspectionGet mapper', () => {
    it('should properly map the ApiInspectionGet object', () => {
      const result = mapApiInspectionGet(data as unknown as ApiInspectionGet);
      expect(result).toEqual(apiInspectionGetParsed);
    });
  });
});
