import monk from '@monkvision/corejs';
import ExpoConstants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

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

const requestPdfPayload = {
  pricing: false,
  customer: ExpoConstants.manifest.extra.PDF_REPORT_CUSTOMER,
  clientName: ExpoConstants.manifest.extra.PDF_REPORT_CLIENT_NAME,
  language: 'fr',
};

export default function useGetPdfReport(inspectionId, onError) {
  const [reportUrl, setReportUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const timeout = useCallback((ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  }), []);

  const handleDownLoad = useCallback(() => download(reportUrl, inspectionId), [reportUrl]);

  const requestPdfReport = useCallback(
    () => monk.entity.inspection.requestInspectionReportPdf(inspectionId, requestPdfPayload),
    [inspectionId, requestPdfPayload],
  );

  const getPdfUrl = useCallback(
    () => monk.entity.inspection.getInspectionReportPdf(inspectionId),
    [inspectionId],
  );

  const preparePdf = useCallback(
    async () => {
      setLoading(true);
      await requestPdfReport();
      let done = false;
      while (!done) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await timeout(2000);
          // eslint-disable-next-line no-await-in-loop
          const res = await getPdfUrl();
          if (res.axiosResponse?.data?.pdfUrl) {
            setReportUrl(res.axiosResponse.data.pdfUrl);
            done = true;
            setLoading(false);
          }
        } catch (err) {
          if (err.status !== 422) {
            console.error('Error while trying to fetch the pdf url :', err);
            if (onError) { onError(err); }
          }
        }
      }
    },
    [inspectionId, requestPdfReport, getPdfUrl, setReportUrl, setLoading],
  );
  return { preparePdf, handleDownLoad, loading, reportUrl };
}
