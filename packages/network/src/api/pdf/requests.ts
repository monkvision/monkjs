import {
  getFileExtensions,
  MonkActionType,
  MonkGotOneInspectionPdfAction,
} from '@monkvision/common';
import ky from 'ky';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiPdf, ApiPdfPost } from '../models/pdf';
import { MonkApiResponse } from '../types';

/**
 * Options passed to the `uploadPdf` API request.
 */
export interface UploadPdfOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * The PDF file to upload.
   */
  pdf: Blob;
  /**
   * The timeout in milliseconds for the request.
   *
   * @default 30000
   */
  timeout?: number;
}

/**
 * Options passed to the `getPdf` API request.
 */
export interface GetPdfOptions {
  /**
   * The ID of the inspection to get the PDF from.
   */
  id: string;
}

interface AddPdfData {
  filename: string;
  body: ApiPdfPost;
}

function getPdfData(options: UploadPdfOptions, filetype: string): AddPdfData {
  const filename = `${options.id}-${Date.now()}.${filetype}`;
  const body: ApiPdfPost = { pdf_post_strategy: 'upload' };
  return { filename, body };
}

const MULTIPART_KEY_PDF_DATA = 'pdf_data';
const MULTIPART_KEY_JSON = 'json';

async function createPdfData(options: UploadPdfOptions): Promise<FormData> {
  const extensions = getFileExtensions(options.pdf.type);
  if (!extensions) {
    throw new Error(`Unknown pdf mimetype : ${options.pdf.type}`);
  }
  const filetype = extensions[0];

  const { filename, body } = getPdfData(options, filetype);

  const file = new File([options.pdf], filename, { type: filetype });

  const data = new FormData();
  data.append(MULTIPART_KEY_JSON, JSON.stringify(body));
  data.append(MULTIPART_KEY_PDF_DATA, file);

  return data;
}

/**
 * Upload a PDF file to an inspection. See the `UploadPdfOptions` interface for more details.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see UploadPdfOptions
 */

export async function uploadPdf(
  options: UploadPdfOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkGotOneInspectionPdfAction>,
): Promise<MonkApiResponse> {
  const kyOptions = {
    ...getDefaultOptions(config),
    ...(!!options.timeout && { timeout: options.timeout }),
  };
  const formData = await createPdfData(options);
  await ky.post(`inspections/${options.id}/pdf`, {
    ...kyOptions,
    body: formData,
  });
  const response = await ky.get(`inspections/${options.id}/pdf`, {
    ...kyOptions,
  });
  const body = await response.json<ApiPdf>();
  dispatch?.({
    type: MonkActionType.GOT_ONE_INSPECTION_PDF,
    payload: { inspectionId: options.id, pdfUrl: body.pdf_url },
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Get a PDF file from an inspection. See the `GetPdfOptions` interface for more details.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see GetPdfOptions
 */

export async function getPdf(
  options: GetPdfOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkGotOneInspectionPdfAction>,
) {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.get(`inspections/${options.id}/pdf`, {
    ...kyOptions,
  });
  const body = await response.json<ApiPdf>();
  dispatch?.({
    type: MonkActionType.GOT_ONE_INSPECTION_PDF,
    payload: { inspectionId: options.id, pdfUrl: body.pdf_url },
  });
  return {
    response,
    body,
  };
}
