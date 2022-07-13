import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import { useCallback, useMemo, useState } from 'react';

const payload = { pricing: true, customer: 'emr', client_name: 'Emr' };

export default function useRequestPdfReport(inspectionId) {
  const [reportUrl, setReportUrl] = useState(null);

  const getPdfAxiosRequest = useCallback(
    async () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const getPdfRequest = useRequest({
    request: getPdfAxiosRequest,
    onRequestSuccess: (res) => setReportUrl(res.data.url),
  });

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.requestInspectionReportPdf(inspectionId, payload),
    [inspectionId],
  );

  const request = useRequest({ request: axiosRequest, onRequestSuccess: getPdfRequest.start });

  const loading = useMemo(
    () => getPdfRequest.state.loading || request.state.loading,
    [request, getPdfRequest],
  );

  const requestReport = useCallback(async () => request.start(), []);

  return { requestReport, request, reportUrl, loading };
}
