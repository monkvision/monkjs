import { createApi } from "@reduxjs/toolkit/query/react";

const providesTags = (result: any, error: any, id: string): any => [
  { type: "Inspection", id },
];
const invalidatesTags: any = ["Inspection"];

const getInspectionApi = (baseQuery: any) =>
  createApi({
    baseQuery,
    reducerPath: "inspection",
    tagTypes: ["Inspection"],
    endpoints: (builder) => ({
      /**
       * getInspectionById
       * action type: inspection/getInspectionById
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_inspection
       *
       * @param id {string}
       */
      getInspectionById: builder.query({
        query: (id) => ({
          url: `inspections/${id}`,
        }),
        providesTags,
      }),

      /**
       * getTasksByInspectionId
       * action type: inspection/getTasksByInspectionId
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection
       *
       * @param id {string}
       */
      getTasksByInspectionId: builder.query({
        query: (id) => ({
          url: `inspections/${id}/tasks`,
        }),
        providesTags,
      }),

      /**
       * getTaskByInspectionIdAndTaskName
       * action type: inspection/getTaskByInspectionIdAndTaskName
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection
       *
       * @param queryArg {Object}
       * @param queryArg.id {string}
       * @param queryArg.taskName {string}
       */
      getTaskByInspectionIdAndTaskName: builder.query({
        query: ({ id, taskName }: any) => ({
          url: `inspections/${id}/tasks/${taskName}`,
        }),
        providesTags,
      }),

      /**
       * patchTaskByInspectionIdAndTaskName
       * action type: inspection/patchTaskByInspectionIdAndTaskName
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/edit_task
       *
       * @param queryArg {Object}
       * @param queryArg.id {string}
       * @param queryArg.taskName {string}
       * @param queryArg.body {Object}
       * @param queryArg.body.status {"NOT_STARTED"|"TODO"}
       */
      patchTaskByInspectionIdAndTaskName: builder.query({
        query: ({ id, taskName, body }: any) => ({
          url: `inspections/${id}/tasks/${taskName}`,
          method: "PATCH",
          body,
        }),
        providesTags,
      }),

      /**
       * getDamageDetectionByInspectionId
       * action type: inspection/getDamageDetectionByInspectionId
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection
       *
       * @param id {string}
       */
      getDamageDetectionByInspectionId: builder.query({
        query: (id) => ({
          url: `inspections/${id}/tasks/damage_detection`,
        }),
        providesTags,
      }),

      /**
       * getInspections
       * action type: inspection/getInspections
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_all_inspections
       *
       * @param queryArg {Object}
       * @param queryArg.paging {Object}
       * @param queryArg.limit {number}
       * @param queryArg.order {"asc"|"desc"}
       */
      getInspections: builder.query({
        query: ({ paging = {}, limit = 100, order = "desc" }: any) => ({
          url: `inspections`,
          params: {
            after: paging.after,
            all_inspections: true,
            before: paging.before,
            limit,
            pagination_order: order,
          },
        }),
        providesTags,
      }),

      /**
       * getAllInspections
       * action type: inspection/getAllInspections
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_all_inspections
       *
       * @param queryArg {Object}
       * @param queryArg.inOrganization {boolean}
       * @param queryArg.order {"asc"|"desc"}
       */
      getAllInspections: builder.query({
        query: ({ inOrganization = false, order = "desc" }: any) => ({
          url: `inspections`,
          params: {
            all_inspections: true,
            all_inspections_in_organization: inOrganization,
            pagination_order: order,
          },
        }),
        providesTags,
      }),

      /**
       * postOneInspection
       * action type: inspection/postOneInspection
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/post_inspection
       *
       * @typedef {Object} AcquisitionUrl
       * @property {"download_from_url"} strategy
       * @property {string} url
       *
       * @typedef {Object} AcquisitionForm
       * @property {"upload_multipart_form_keys"} strategy
       * @property {File} file_key
       *
       * @typedef {Object} AdditionalData
       *
       * @typedef {Object} Task
       * @property {Object} damage_detection
       * @property {Object} hubcap_analysis
       * @property {Object} repair_estimate
       * @property {Object} documents_ocr
       *
       * @typedef {Object} Image
       * @property {string} name
       * @property {AcquisitionUrl|AcquisitionForm} acquisition
       * @property {
       * "NO_ROTATION"|
       * "CLOCKWISE_90"|
       * "CLOCKWISE_180"|
       * "CLOCKWISE_270"
       * } rotate_image_before_upload
       * @property {AdditionalData} additional_data
       *
       * @param body {Object}
       * @param body.additional_data {AdditionalData}
       * @param body.tasks {Task}
       * @param body.images {[Image]}
       */
      postOneInspection: builder.query({
        query: (body) => ({
          url: `inspections`,
          method: "POST",
          body,
        }),
        invalidatesTags,
      }),

      /**
       * patchInfoByInspectionId
       * action type: inspection/patchInfoByInspectionId
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/edit_inspection_pdf_data
       *
       * @typedef {Object} PdfInputData
       * @property {string} mileage
       * @property {string} agent_first_name
       * @property {string} agent_last_name
       * @property {string} agent_company
       * @property {string} agent_company_city
       * @property {string} vehicle_owner_first_name
       * @property {string} vehicle_owner_last_name
       * @property {string} vehicle_owner_address
       * @property {string} vehicle_owner_phone
       * @property {string} vehicle_owner_email
       * @property {string} date_of_start
       * @property {string} date_of_validation
       * @property {string} vin_or_registering
       * @property {string} agent_signature_url
       * @property {string} vehicle_owner_signature_url
       *
       * @param queryArg {Object}
       * @param queryArg.id {string}
       * @param queryArg.body {PdfInputData}
       */
      patchInfoByInspectionId: builder.query({
        query: ({ id, body }: any) => ({
          url: `inspections/${id}/pdf_data`,
          method: "PATCH",
          body,
        }),
        invalidatesTags,
      }),

      /**
       * patchSignaturesByInspectionId
       * action type: inspection/patchSignaturesByInspectionId
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/sign_inspection
       *
       * @param queryArg {Object}
       * @param queryArg.id {string}
       * @param queryArg.body {Object}
       * @param queryArg.body.agent_signature_url {string}
       * @param queryArg.body.vehicle_owner_signature_url {string}
       */
      patchSignaturesByInspectionId: builder.query({
        query: ({ id, body }: any) => ({
          url: `inspections/${id}/sign`,
          method: "PATCH",
          body,
        }),
        invalidatesTags,
      }),

      /**
       * getImagesByInspectionId
       * action type: inspection/getImagesByInspectionId
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_images_of_inspection
       *
       * @param queryArg {Object}
       * @param queryArg.id {string}
       * @param queryArg.paging {Object}
       * @param queryArg.limit {number}
       * @param queryArg.order {"asc"|"desc"}
       */
      getImagesByInspectionId: builder.query({
        query: ({ id, paging = {}, limit = 100, order = "desc" }: any) => ({
          url: `inspections/${id}/images`,
          params: {
            after: paging.after,
            all_inspections: true,
            before: paging.before,
            limit,
            pagination_order: order,
          },
        }),
        providesTags,
      }),

      /**
       * postOneImageToInspectionById
       * action type: inspection/postOneImageToInspectionById
       * https://api.preview.monk.ai/v1/apidocs/#/Inspection/add_image_to_inspection
       *
       * @typedef {Object} AcquisitionUrl
       * @property {"download_from_url"} strategy
       * @property {string} url
       *
       * @typedef {Object} AcquisitionForm
       * @property {"upload_multipart_form_keys"} strategy
       * @property {File} file_key
       *
       * @typedef {Object} AdditionalData
       *
       * @typedef {Object} Task
       * @property {Object} damage_detection
       * @property {Object} hubcap_analysis
       * @property {Object} repair_estimate
       * @property {Object} documents_ocr
       *
       * @typedef {"damage_detection"|"hubcap_analysis"|"repair_estimate"|"documents_ocr"} TaskEnum
       *
       * @typedef {Object} Image
       * @property {string} name
       * @property {AcquisitionUrl|AcquisitionForm} acquisition
       * @property {
       * "NO_ROTATION"|
       * "CLOCKWISE_90"|
       * "CLOCKWISE_180"|
       * "CLOCKWISE_270"
       * } rotate_image_before_upload
       * @property {
       * Task.damage_detection|
       * Task.hubcap_analysis|
       * Task.repair_estimate|
       * Task.documents_ocr|
       * TaskEnum
       * } tasks
       * @property {AdditionalData} additional_data
       *
       * @param id {string}
       * @param body {Image}
       */
      postOneImageByInspectionId: builder.query({
        query: ({ id, body }) => ({
          url: `inspections/${id}/images`,
          method: "POST",
          body,
        }),
        invalidatesTags,
      }),
    }),
  });

export default getInspectionApi;
