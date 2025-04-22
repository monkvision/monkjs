jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  getFileExtensions: jest.fn(() => ['aaa', 'bbb']),
}));
jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));

import ky from 'ky';
import { getFileExtensions, MonkActionType } from '@monkvision/common';
import { getDefaultOptions } from '../../../src/api/config';
import { getPdf, uploadPdf, UploadPdfOptions } from '../../../src/api/pdf';

function createPdfMock(): UploadPdfOptions {
  return {
    id: 'test-id',
    pdf: new Blob(['test-pdf'], { type: 'application/pdf' }),
  };
}

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

describe('pdf requests', () => {
  let fileMock: File;
  let fileConstructorSpy: jest.SpyInstance;

  beforeEach(() => {
    fileMock = { test: 'hello' } as unknown as File;
    fileConstructorSpy = jest.spyOn(global, 'File').mockImplementationOnce(() => fileMock);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadPdf request', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should make the proper API call', async () => {
      const dispatch = jest.fn();
      const options = createPdfMock();
      const result = await uploadPdf(options, apiConfig, dispatch);
      await (ky.post as jest.Mock).mock.results[0].value;
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();
      // expect(mapApiPdfPostRequest).toHaveBeenCalled();
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.post).toHaveBeenCalledWith(
        `inspections/${options.id}/pdf`,
        expect.objectContaining(getDefaultOptions(apiConfig)),
      );
      expect(ky.get).toHaveBeenCalledWith(
        `inspections/${options.id}/pdf`,
        expect.objectContaining(getDefaultOptions(apiConfig)),
      );
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });

    it('should properly update the state', async () => {
      const dispatch = jest.fn();
      const options = createPdfMock();
      const result = await uploadPdf(options, apiConfig, dispatch);
      await (ky.post as jest.Mock).mock.results[0].value;
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: MonkActionType.GOT_ONE_INSPECTION_PDF,
        payload: {
          inspectionId: options.id,
          pdfUrl: body.pdf_url,
        },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });

    it('should properly create the formdata for a pdf', async () => {
      const dispatch = jest.fn();
      const options = createPdfMock();
      await uploadPdf(options, apiConfig, dispatch);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        pdf_post_strategy: 'upload',
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.pdf.type);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.pdf],
        expect.stringMatching(new RegExp(`${options.id}-\\d{13}.${filetype}`)),
        { type: filetype },
      );
    });

    it('should properly use the timeout if defined', async () => {
      const timeout = 60000;
      const dispatch = jest.fn();
      const options = { ...createPdfMock(), timeout };
      await uploadPdf(options, apiConfig, dispatch);
      await (ky.post as jest.Mock).mock.results[0].value;
      expect(ky.post).toHaveBeenCalledWith(
        `inspections/${options.id}/pdf`,
        expect.objectContaining({ ...getDefaultOptions(apiConfig), timeout }),
      );
    });
  });

  describe('getPdf request', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should make the proper API call', async () => {
      const dispatch = jest.fn();
      const options = { id: 'test-id' };
      const result = await getPdf(options, apiConfig, dispatch);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      expect(ky.get).toHaveBeenCalledWith(
        `inspections/${options.id}/pdf`,
        expect.objectContaining(getDefaultOptions(apiConfig)),
      );
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });

    it('should properly update the state', async () => {
      const dispatch = jest.fn();
      const options = { id: 'test-id' };
      const result = await getPdf(options, apiConfig, dispatch);
      const response = await (ky.get as jest.Mock).mock.results[0].value;
      const body = await response.json();
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: MonkActionType.GOT_ONE_INSPECTION_PDF,
        payload: {
          inspectionId: options.id,
          pdfUrl: body.pdf_url,
        },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });

    it('should properly create the formdata for a pdf', async () => {
      const dispatch = jest.fn();
      const options = createPdfMock();
      await uploadPdf(options, apiConfig, dispatch);

      expect(ky.post).toHaveBeenCalled();
      const formData = (ky.post as jest.Mock).mock.calls[0][1].body as FormData;
      expect(typeof formData?.get('json')).toBe('string');
      expect(JSON.parse(formData.get('json') as string)).toEqual({
        pdf_post_strategy: 'upload',
      });
      expect(getFileExtensions).toHaveBeenCalledWith(options.pdf.type);
      const filetype = (getFileExtensions as jest.Mock).mock.results[0].value[0];
      expect(fileConstructorSpy).toHaveBeenCalledWith(
        [options.pdf],
        expect.stringMatching(new RegExp(`${options.id}-\\d{13}.${filetype}`)),
        { type: filetype },
      );
    });
  });
});
