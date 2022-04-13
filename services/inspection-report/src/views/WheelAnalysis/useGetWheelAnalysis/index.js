import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import monk from '@monkvision/corejs';

export default function useGetWheelAnalysis(imagesEntities, wheelAnalysisId) {
  const wheelAnalysisImages = useMemo(() => {
    const allWheelAnalysisImages = Object.values(imagesEntities).filter(
      (image) => image?.wheelAnalysis,
    );

    const currentImages = allWheelAnalysisImages.filter(
      (image) => image.wheelAnalysis.id === wheelAnalysisId,
    );
    return currentImages;
  }, [imagesEntities, wheelAnalysisId]);

  const wheelAnalysis = useSelector(
    (state) => monk.entity.wheelAnalysis.selectors
      .selectById(state, wheelAnalysisId),
  );

  return { images: wheelAnalysisImages, wheelAnalysis };
}
