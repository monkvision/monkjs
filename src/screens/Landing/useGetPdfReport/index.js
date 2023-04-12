import monk from '@monkvision/corejs';
import ExpoConstants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useWebSocket } from '../../../context/socket';

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

export default function useGetPdfReport(inspectionId, onError) {
  const [reportUrl, setReportUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { i18n } = useTranslation();
  const { onSocketEvent } = useWebSocket();

  const requestPdfPayload = useMemo(() => ({
    pricing: false,
    customer: ExpoConstants.manifest.extra.PDF_REPORT_CUSTOMER,
    clientName: ExpoConstants.manifest.extra.PDF_REPORT_CLIENT_NAME,
    language: i18n.language?.substring(0, 2) ?? 'en',
  }), [i18n.language]);

  const timeout = useCallback((ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  }), []);

  const handleDownload = useCallback(() => download(reportUrl, inspectionId), [reportUrl]);

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
      // Send/Listen an event from server
      onSocketEvent('ready_inspection_pdf_url', async () => {
        try {
          const res = await getPdfUrl();
          if (res.axiosResponse?.data?.pdfUrl) {
            setReportUrl(res.axiosResponse.data.pdfUrl);
            setLoading(false);
          }
        } catch (err) {
          if (err.status !== 422) {
            console.error('Error while trying to fetch the pdf url :', err);
            if (onError) { onError(err); }
          }
        }
      });
      // api call for pdf report
      await requestPdfReport();
    },
    [inspectionId, requestPdfReport, getPdfUrl, setReportUrl, setLoading],
  );
  return { preparePdf, handleDownload, loading, reportUrl };
}
