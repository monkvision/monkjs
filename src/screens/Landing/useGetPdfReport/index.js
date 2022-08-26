import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import ExpoConstants from 'expo-constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const webDownload = (url, inspectionId) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blanc';
  link.download = inspectionId;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const nativeDownload = async (url, inspectionId) => {
  await FileSystem.downloadAsync(
    url,
    `${FileSystem.documentDirectory}${inspectionId}.pdf`,
  );
};

const download = Platform.OS === 'web' ? webDownload : nativeDownload;

const payload = {
  pricing: false,
  customer: ExpoConstants.manifest.extra.PDF_REPORT_CUSTOMER,
  client_name: ExpoConstants.manifest.extra.PDF_REPORT_CLIENT_NAME,
  language: 'fr',
};

export default function useGetPdfReport(inspectionId) {
  const [reportUrl, setReportUrl] = useState(null);

  // this ref is used to run the get pdf request by itself (before its declaration) in line 38
  const ref = useRef({});

  const handleDownLoad = useCallback(() => download(reportUrl, inspectionId), [reportUrl]);

  const getPdfAxiosRequest = useCallback(
    () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const getPdfRequest = useRequest({
    request: getPdfAxiosRequest,
    onRequestSuccess: (res) => setReportUrl(res.axiosResponse.data.pdf_url),
    onRequestFailure: () => ref.current.state.count <= 1
      && setTimeout(ref.current?.getReport, 2000),
  });

  const axiosRequest = useCallback(
    () => monk.entity.inspection.requestInspectionReportPdf(inspectionId, payload),
    [inspectionId],
  );

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: () => setTimeout(getPdfRequest.start, 2000),
  });

  const loading = useMemo(
    () => getPdfRequest.state.loading || request.state.loading,
    [request, getPdfRequest],
  );

  const requestReport = useCallback(
    () => request.state.count < 1 && request.start(),
    [request],
  );
  const getReport = useCallback(() => getPdfRequest.start(), []);

  ref.current = { getReport, ...getPdfRequest };

  return { requestReport, handleDownLoad, reportUrl, loading };
}
