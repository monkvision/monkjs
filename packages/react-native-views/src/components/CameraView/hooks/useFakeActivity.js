import { useCallback, useState } from 'react';
import noop from 'lodash.noop';

const MIN_LOADING_TIME = 500; // in ms

/**
 * Use fake activity when you need to render ActivityIndicator for better UX
 */
function useFakeActivity() {
  const [fakeActivity, setFakeActivity] = useState(null);

  const handleFakeActivity = useCallback((onEnd = noop) => {
    const fakeActivityId = setTimeout(() => {
      setFakeActivity(null);
      onEnd();
    }, MIN_LOADING_TIME);

    setFakeActivity(fakeActivityId);

    return () => {
      clearTimeout(fakeActivityId);
    };
  }, []);

  return [fakeActivity, handleFakeActivity];
}

export default useFakeActivity;
