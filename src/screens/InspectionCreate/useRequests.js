import { createOneInspection, updateOneTaskOfInspection } from '@monkvision/corejs';

import useMediaGallery from 'hooks/useMediaGallery';
import useRequest from 'hooks/useRequest';

function useCreateInspectionRequest(screen) {
  const payload = {
    data: { tasks: { damage_detection: { status: 'NOT_STARTED' } } },
  };

  const callbacks = {
    onSuccess: ({ result }) => screen.setInspectionId(result),
  };

  return useRequest(createOneInspection(payload), callbacks);
}

function useUpdateTaskRequest(screen) {
  const payload = {
    inspectionId: screen.state.inspectionId,
    taskName: 'damage_detection',
    data: { status: 'TODO' },
  };

  const callbacks = {
    onSuccess: () => {
      screen.setTaskUpdated(true);
      screen.handleNext();
    },
  };

  return useRequest(updateOneTaskOfInspection(payload), callbacks, false);
}

export default function useRequests(screen) {
  return {
    createInspection: useCreateInspectionRequest(screen),
    updateTask: useUpdateTaskRequest(screen),
    savePictures: useMediaGallery(),
  };
}
