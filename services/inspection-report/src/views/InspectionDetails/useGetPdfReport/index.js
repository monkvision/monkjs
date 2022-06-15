import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import { useCallback, useEffect } from 'react';

export default function useGetPdfReport(inspectionId) {
//   const dispatch = useDispatch();

  useEffect(() => {
    if (inspectionId) {
      monk.entity.inspection.getInspectionReportPdf(inspectionId);
    }
  }, [inspectionId]);

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: (res) => console.log(res),
  });

  const getReport = useCallback(async () => request.start(), []);

  useEffect(() => { getReport(); }, []);
}
