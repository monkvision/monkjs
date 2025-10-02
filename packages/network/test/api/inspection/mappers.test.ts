import apiInspectionGetData from './data/apiInspectionGet.data.json';
import apiInspectionGetMapped from './data/apiInspectionGet.data';
import apiInspectionPostData from './data/apiInspectionPost.data';
import apiInspectionPostMapped from './data/apiInspectionPost.data.json';
import apiAllInspectionsVerboseGetData from './data/apiAllInspectionsVerboseGet.data.json';
import apiAllInspectionsVerboseGetMapped from './data/apiAllInspectionsVerboseGet.data';
import { ApiAllInspectionsVerboseGet, ApiInspectionGet } from '../../../src/api/models';
import {
  GetAllInspectionsOptions,
  mapApiAllInspectionsUrlParamsGet,
  mapApiAllInspectionsVerboseGet,
  mapApiInspectionGet,
  mapApiInspectionPost,
  mapApiInspectionUrlParamsGet,
} from '../../../src/api/inspection/mappers';
import { sdkVersion } from '../../../src/api/config';
import { CreateInspectionOptions, SortOrder } from '@monkvision/types';

describe('Inspection API Mappers', () => {
  describe('ApiInspectionGet mapper', () => {
    it('should properly map the ApiInspectionGet object', () => {
      const result = mapApiInspectionGet(apiInspectionGetData as unknown as ApiInspectionGet, '');
      expect(result).toEqual(apiInspectionGetMapped);
    });
  });

  describe('ApiInspectionPost mapper', () => {
    it('should properly map the ApiInspectionGet object', () => {
      const result = mapApiInspectionPost(apiInspectionPostData as CreateInspectionOptions);
      (apiInspectionPostMapped.additional_data as any).user_agent = expect.any(String);
      (apiInspectionPostMapped.additional_data as any).monk_sdk_version = sdkVersion;
      expect(result).toEqual(apiInspectionPostMapped);
    });
  });

  describe('ApiAllInspectionsVerboseGet mapper', () => {
    it('should properly map the ApiAllInspectionsVerboseGet object', () => {
      const result = mapApiAllInspectionsVerboseGet(
        apiAllInspectionsVerboseGetData as unknown as ApiAllInspectionsVerboseGet[],
        '',
      );
      expect(result).toEqual(apiAllInspectionsVerboseGetMapped);
    });
  });

  describe('mapApiAllInspectionsUrlParamsGet mapper', () => {
    it('should properly map the url parameters and filter out the verbose option', () => {
      const options: GetAllInspectionsOptions = {
        filters: {
          test: 'testFilter',
          test2: 5,
          verbose: 0,
          formatTest: 'test special&chars',
        },
        sort: {
          sortByProperty: 'sortProp',
          sortOrder: SortOrder.DESC,
        },
        pagination: {
          after: 'after-test',
          before: 'before-test',
          limit: 32,
        },
      };
      let result = mapApiAllInspectionsUrlParamsGet(options, true, false);
      const params = [
        'verbose=1',
        'show_deleted=false',
        'test=testFilter',
        'test2=5',
        'formatTest=test+special%26chars',
        'after=after-test',
        'before=before-test',
        'limit=32',
        'order_by=sortProp',
        'pagination_order=desc',
      ];
      const length = params.reduce((prev, curr) => prev + curr.length + 1, 0);
      expect(result.startsWith('?')).toBe(true);
      expect(result.length).toEqual(length);
      params.forEach((param) => {
        expect(result.includes(param)).toBe(true);
        result = result.replace(param, '');
      });
      expect(result).toEqual(`?${'&'.repeat(params.length - 1)}`);
    });

    it('should properly map the verbose param', () => {
      let result = mapApiAllInspectionsUrlParamsGet({}, false, false);
      expect(result).toEqual('?verbose=0&show_deleted=false');

      result = mapApiAllInspectionsUrlParamsGet({}, null, false);
      expect(result).toEqual('?show_deleted=false');
    });
  });

  describe('mapApiInspectionUrlParamsGet mapper', () => {
    it('should properly map the verbose param to light', () => {
      const result = mapApiInspectionUrlParamsGet(true);
      expect(result).toEqual('?verbose=light');
    });

    it('should not include verbose', () => {
      const result = mapApiInspectionUrlParamsGet(false);
      expect(result).toEqual('');
    });

    it('should not include verbose - undefined case', () => {
      const result = mapApiInspectionUrlParamsGet(undefined);
      expect(result).toEqual('');
    });
  });
});
