import type { ApiRenderedOutputs } from './renderedOutput';

export interface ApiBoundingBox {
  xmin: number;
  ymin: number;
  width: number;
  height: number;
}

export type ApiPolygons = number[][][];

export interface ApiSpecification {
  bounding_box?: ApiBoundingBox;
  polygons?: ApiPolygons;
}

export interface ApiImageRegion {
  id: string;
  image_id: string;
  specification: ApiSpecification;
}

export interface ApiView {
  element_id: string;
  id: string;
  image_region: ApiImageRegion;
  rendered_outputs: ApiRenderedOutputs;
}

export type ApiViews = ApiView[];
