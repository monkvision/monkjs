import type { ApiAdditionalData } from './common';

export interface ApiRenderedOutput {
  additional_data?: ApiAdditionalData;
  base_image_id: string;
  id: string;
  path: string;
}

export type ApiRenderedOutputs = ApiRenderedOutput[];
