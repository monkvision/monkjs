import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useRequestPdfReport from '../useRequestPdfReport';

const download = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function useGetPdfReport(inspectionId) {
  const [reportUrl, setReportUrl] = useState(null);

  const {
    requestReport,
    reportUrl: reportUrlAfterRequesting,
    loading: requestPdfLoading,
  } = useRequestPdfReport(inspectionId);

  const handleDownLoad = useCallback(() => download(reportUrl), [reportUrl]);

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: (res) => setReportUrl(res.data.url),
    onRequestFailure: requestReport,
  });

  const getReport = useCallback(() => request.start(), []);

  const loading = useMemo(
    () => requestPdfLoading || request.state.loading,
    [request, requestPdfLoading],
  );

  useEffect(() => { getReport(); }, []);

  return { reportUrl: reportUrl || reportUrlAfterRequesting, handleDownLoad, loading };
}
