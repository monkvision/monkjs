import { createApi } from '@reduxjs/toolkit/query/react';

const providesTags = (result, error, id) => [{ type: 'Inspection', id }];
const invalidatesTags = ['Inspection'];

const getInspectionApi = (baseQuery) => createApi({
  baseQuery,
  reducerPath: 'inspection',
  tagTypes: ['Inspection'],
  endpoints: (builder) => ({

    /**
     * getInspectionById
     * action type: inspection/getInspectionById
     * https://core-api-4la6rtzclq-ew.a.run.app/v1/apidocs/#/Inspection/get_inspection
     */
    getInspectionById: builder.query({
      query: (id) => ({
        url: `inspections/${id}`,
      }),
      providesTags,
    }),

    /**
     * getInspections
     * action type: inspection/getInspections
     * https://core-api-4la6rtzclq-ew.a.run.app/v1/apidocs/#/Inspection/get_all_inspections
     */
    getInspections: builder.query({
      query: ({ paging = {}, limit = 100, order = 'desc' } = {}) => ({
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
     * https://core-api-4la6rtzclq-ew.a.run.app/v1/apidocs/#/Inspection/get_all_inspections
     */
    getAllInspections: builder.query({
      query: ({ inOrganization = false, order = 'desc' } = {}) => ({
        url: `inspections`,
        params: {
          all_inspections: true,
          all_inspections_in_organization: inOrganization,
          pagination_order: order },
      }),
      providesTags,
    }),

    /**
     * postOneInspection
     * action type: inspection/postOneInspection
     * https://core-api-4la6rtzclq-ew.a.run.app/v1/apidocs/#/Inspection/post_inspection
     */
    postOneInspection: builder.query({
      query: (body) => ({ url: `inspections`, method: 'POST', body }),
      invalidatesTags,
    }),

  }),
});

export default getInspectionApi;
