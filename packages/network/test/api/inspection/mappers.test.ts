import apiInspectionGetData from './data/apiInspectionGet.data.json';
import apiInspectionGetMapped from './data/apiInspectionGet.data';
import apiInspectionPostData from './data/apiInspectionPost.data';
import apiInspectionPostMapped from './data/apiInspectionPost.data.json';
import { ApiInspectionGet } from '../../../src/api/models';
import { mapApiInspectionGet, mapApiInspectionPost } from '../../../src/api/inspection/mappers';
import { sdkVersion } from '../../../src/api/config';
import { CreateInspectionOptions } from '@monkvision/types';

describe('Inspection API Mappers', () => {
  describe('ApiInspectionGet mapper', () => {
    it('should properly map the ApiInspectionGet object', () => {
      const result = mapApiInspectionGet(apiInspectionGetData as unknown as ApiInspectionGet, '');
      expect(result).toEqual(apiInspectionGetMapped);
    });
  });

  describe('ApiInspectionPost mapper', () => {
    it('should properly map the ApiInspectionGet object', () => {
      const result = mapApiInspectionPost(
        apiInspectionPostData as unknown as CreateInspectionOptions,
      );
      (apiInspectionPostMapped.additional_data as any).user_agent = expect.any(String);
      (apiInspectionPostMapped.additional_data as any).monk_sdk_version = sdkVersion;
      expect(result).toEqual(apiInspectionPostMapped);
    });
  });
});
