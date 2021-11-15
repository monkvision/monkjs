import { useEffect, useMemo } from 'react';

/**
 * When last picture is taken
 * @param onSuccess
 * @param payload
 * @param handleFakeActivity
 */
function useSuccess(onSuccess, payload, handleFakeActivity) {
  const { pictures, sights } = payload;

  const sightsCount = sights.length;
  const picturesCount = useMemo(
    () => Object.values(pictures).filter((p) => p.source).length,
    [pictures],
  );

  useEffect(() => {
    if (sightsCount === picturesCount) {
      handleFakeActivity(() => onSuccess(payload));
    }
  }, [handleFakeActivity, onSuccess, payload, picturesCount, sightsCount]);
}

export default useSuccess;
