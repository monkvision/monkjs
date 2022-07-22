import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import { useCallback, useEffect, useMemo, useState } from 'react';

const download = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blanc';
  link.download = 'Download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const payload = {
  pricing: true,
  customer: 'monk_QSBtYXJ0aW5pLiBTaGFrZW4sIG5vdCBzdGlycmVkLgo=',
  client_name: 'Monk',
  language: 'fr',
};

export default function useGetPdfReport(inspectionId) {
  const [reportUrl, setReportUrl] = useState(null);

  const handleDownLoad = useCallback(() => download(reportUrl), [reportUrl]);

  const getPdfAxiosRequest = useCallback(
    async () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const getPdfRequest = useRequest({
    request: getPdfAxiosRequest,
    onRequestSuccess: (res) => setReportUrl(res.axiosResponse.data.pdf_url),
  });

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.requestInspectionReportPdf(inspectionId, payload),
    [inspectionId],
  );

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: () => setTimeout(getPdfRequest.start, 1000),
  });

  const loading = useMemo(
    () => getPdfRequest.state.loading || request.state.loading,
    [request, getPdfRequest],
  );

  const requestReport = useCallback(async () => request.start(), []);

  useEffect(() => { requestReport(); }, [requestReport]);

  return { handleDownLoad, reportUrl, loading };
}
