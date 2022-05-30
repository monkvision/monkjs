import { useMemo } from 'react';

export default function useStatus({ compliance, upload }) {
  const isPending = useMemo(() => (
    upload.status === 'pending' || (upload.status === 'fulfilled' && compliance.status === 'pending')
  ), [compliance, upload]);

  const isFailure = useMemo(() => upload.error, [upload]);

  const isUnknown = useMemo(() => {
    const allCompliancesAreUnkown = compliance.result
        && Object.values(compliance.result?.data?.compliances).every(
          (c) => c.is_compliant === null,
        );

    return !isPending && allCompliancesAreUnkown;
  }, [compliance, isPending]);

  return { isPending, isFailure, isUnknown };
}
