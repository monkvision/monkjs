import { updateOneTaskOfInspection } from '@monkvision/corejs';

import useMediaGallery from 'hooks/useMediaGallery';
import useRequest from 'hooks/useRequest';

function useUpdateTaskRequest(screen) {
  const payload = {
    inspectionId: screen.state.inspectionId,
    taskName: 'damage_detection',
    data: { status: 'TODO' },
  };

  const callbacks = {
    onSuccess: () => {
      screen.setTaskUpdated(true);
    },
  };

  return useRequest(updateOneTaskOfInspection(payload), callbacks, false);
}

export default function useRequests(screen) {
  return {
    updateTask: useUpdateTaskRequest(screen),
    savePictures: useMediaGallery(),
  };
}
