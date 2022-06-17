import { useMemo } from 'react';

export default function useStatus({ compliance, upload }) {
  const isPending = useMemo(() => (
    upload.status === 'pending' || (upload.status === 'fulfilled' && compliance.status === 'pending')
  ), [compliance, upload]);

  const isComplianceUnknown = useMemo(() => compliance.status === 'unsatisfied', [compliance]);

  const isUploadFailed = useMemo(() => upload.error, [upload.error]);

  const { isComplianceIdle, isComplianceFailed } = useMemo(() => ({
    isComplianceFailed: compliance.status === 'rejected',
    isComplianceIdle: compliance.status === 'idle',
  }), [compliance.status]);

  return {
    isPending,
    isUploadFailed,
    isComplianceIdle,
    isComplianceFailed,
    isComplianceUnknown,
  };
}
