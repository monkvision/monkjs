import getInspection from './getInspection.testdata.json';
import getInspectionParsed from './getInspectionParsed.testdata';
import { mapGetInspectionResponse } from '../../../../src/api/requests/inspections/mappers';
import { ApiInspectionGet } from '../../../../src/api/apiModels';

describe('GetInspection Mapper', () => {
  it('should properly map the getInspection object', () => {
    const result = mapGetInspectionResponse(getInspection as unknown as ApiInspectionGet);
    expect(result).toEqual(getInspectionParsed);
  });
});
