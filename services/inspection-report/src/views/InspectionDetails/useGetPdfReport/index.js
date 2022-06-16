import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import { useCallback, useEffect, useState } from 'react';

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

  const handleDownLoad = useCallback(() => download(reportUrl), [reportUrl]);

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: (res) => setReportUrl(res.data.url),
  });

  const getReport = useCallback(async () => request.start(), []);

  useEffect(() => { getReport(); }, []);

  return { reportUrl, handleDownLoad };
}
