import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import monk from '@monkvision/corejs';
import { Platform } from 'react-native';

const DEFAULT_FETCH_INTERVAL_MS = 2000;

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

export const PdfStatus = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  REQUESTED: 'REQUESTED',
  READY: 'READY',
  ERROR: 'ERROR',
};

export default function usePdfReport({
  inspectionId,
  generatePdf,
  customer,
  clientName,
  isInspectionReady,
  fetchInterval = DEFAULT_FETCH_INTERVAL_MS,
}) {
  const [pdfStatus, setPdfStatus] = useState(PdfStatus.NOT_REQUESTED);
  const [reportUrl, setReportUrl] = useState(null);
  const { i18n } = useTranslation();

  const pdfRequestPayload = useMemo(() => ({
    pricing: true,
    customer,
    clientName,
    language: i18n.language?.substring(0, 2) ?? 'en',
  }), [i18n.language]);

  const fetchPdf = useCallback(
    () => monk.entity.inspection.getInspectionReportPdf(inspectionId).then((res) => {
      if (res.axiosResponse?.data?.pdfUrl) {
        setReportUrl(res.axiosResponse.data.pdfUrl);
        setPdfStatus(PdfStatus.READY);
      } else {
        throw new Error('Unknown response from server while fetching PDF.');
      }
    }).catch((err) => {
      const status = err.status ?? err.response?.status;
      if (!status || status !== 422) {
        console.error('Error while trying to fetch the PDF download URL :', err);
        setPdfStatus(PdfStatus.ERROR);
      }
    }),
    [inspectionId],
  );

  useEffect(() => {
    if (pdfStatus === PdfStatus.REQUESTED) {
      const interval = setInterval(() => fetchPdf(), fetchInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [pdfStatus, fetchPdf]);

  const requestPdf = useCallback(
    () => monk.entity.inspection
      .requestInspectionReportPdf(inspectionId, pdfRequestPayload)
      .then(() => setPdfStatus(PdfStatus.REQUESTED))
      .catch((err) => {
        console.error('Error while trying to request the PDF generation :', err);
        setPdfStatus(PdfStatus.ERROR);
      }),
    [generatePdf, inspectionId, isInspectionReady, pdfRequestPayload, pdfStatus],
  );

  const handleDownload = useCallback(() => {
    if (pdfStatus !== PdfStatus.READY) {
      console.error('Can\'t download the PDF right now, PDF is not ready!');
      return;
    }
    download(reportUrl, inspectionId).catch((err) => {
      console.error('Error while downloading the PDF :', err);
    });
  }, [pdfStatus, reportUrl, inspectionId]);

  return {
    reportUrl,
    pdfStatus,
    requestPdf,
    handleDownload,
  };
}
