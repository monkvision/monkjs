import { useMemo } from 'react';

export default function useStatus({ compliance, upload }) {
  const isPending = useMemo(() => (
    upload.status === 'pending' || (upload.status === 'fulfilled' && compliance.status === 'pending')
  ), [compliance, upload]);

  const isUploadFailed = useMemo(() => upload.error, [upload.error]);

  const { isComplianceIdle, isComplianceFailed } = useMemo(() => ({
    isComplianceFailed: compliance.status === 'rejected',
    isComplianceIdle: compliance.status === 'idle',
  }), [compliance.status]);

  const isComplianceUnknown = useMemo(() => {
    const allCompliancesAreUnkown = compliance.result
        && Object.values(compliance.result?.data?.compliances).every(
          (c) => c.is_compliant === null,
        );

    return !isPending && allCompliancesAreUnkown;
  }, [compliance, isPending]);

  return { isPending, isUploadFailed, isComplianceIdle, isComplianceFailed, isComplianceUnknown };
}
