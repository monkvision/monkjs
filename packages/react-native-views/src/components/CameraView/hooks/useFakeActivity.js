import { useCallback, useState } from 'react';
import noop from 'lodash.noop';

function useFakeActivity() {
  const [fakeActivity, setFakeActivity] = useState(null);

  const handleFakeActivity = useCallback((onEnd = noop) => {
    const fakeActivityId = setTimeout(() => {
      setFakeActivity(null);
      onEnd();
    }, 500);

    setFakeActivity(fakeActivityId);

    return () => {
      clearTimeout(fakeActivityId);
    };
  }, []);

  return [fakeActivity, handleFakeActivity];
}

export default useFakeActivity;
