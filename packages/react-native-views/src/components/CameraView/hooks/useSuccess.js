import { useEffect } from 'react';

function useSuccess(onSuccess, payload, handleFakeActivity) {
  const { pictures, camera, sights } = payload;
  const nbOfSights = sights.length;

  useEffect(() => {
    const picturesTaken = Object.values(pictures).filter((p) => Boolean(p.source)).length;
    if (nbOfSights === picturesTaken) {
      handleFakeActivity(() => onSuccess(payload));
    }
  }, [camera, nbOfSights, handleFakeActivity, onSuccess, pictures, sights, payload]);
}

export default useSuccess;
