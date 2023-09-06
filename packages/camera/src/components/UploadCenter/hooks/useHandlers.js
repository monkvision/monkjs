import { useCallback, useEffect, useState } from 'react';
import { useStartUploadAsync } from '../../Capture/hooks';
import Actions from '../../../actions';

const getItemById = (id, array) => array.find((item) => item.id === id);
const hasTodo = (c) => c?.is_compliant === null || c?.status === 'TODO';

export default function useHandlers({
  inspectionId,
  task,
  onRetakeAll,
  checkComplianceAsync,
  ids,
  mapTasksToSights,
  enableCarCoverage,
  ...states
}) {
  const { sights, compliance, uploads } = states;
  const [complianceToCheck, setComplianceToCheck] = useState([]);

  const uploadParams = {
    inspectionId,
    sights,
    uploads,
    mapTasksToSights,
    task,
    enableCarCoverage,
  };
  const startUploadAsync = useStartUploadAsync(uploadParams);

  const handleRetakeAll = useCallback(() => {
    const complianceInitialState = { id: '', status: 'idle', error: null, requestCount: 2, result: null, imageId: null };
    const complianceState = {};
    ids.forEach((id) => { complianceState[id] = { ...complianceInitialState, id }; });

    // reset the uploads state with the new incoming ones
    uploads.dispatch({ type: Actions.uploads.RESET_UPLOADS, ids: { sightIds: ids } });

    // reset the compliance state with the new incoming ones
    compliance.dispatch({ type: Actions.compliance.RESET_COMPLIANCE,
      ids: { initialState: complianceState } });

    // reset sights state with the new incoming ones
    sights.dispatch({ type: Actions.sights.RESET_TOUR, payload: { sightIds: ids } });

    onRetakeAll();
  }, [ids, onRetakeAll, sights, uploads]);

  const handleRetake = useCallback((id) => {
    const compliancePayload = { id, status: 'idle', error: null, result: null, imageId: null };
    const uploadsPayload = { id, status: 'idle', picture: null };
    // reset upload and compliance info, and update the current sight
    compliance.dispatch({ type: Actions.compliance.UPDATE_COMPLIANCE, payload: compliancePayload });
    uploads.dispatch({ type: Actions.uploads.UPDATE_UPLOAD, payload: uploadsPayload });
    sights.dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
    onRetakeAll();
  }, [compliance, sights, uploads]);

  const handleReUpload = useCallback(async (id, picture, language) => {
    const current = {
      id,
      metadata: { id, label: getItemById(id, sights.state.tour).label[language] },
    };
    // add sight id to the compliance queue and start uploading the image
    setComplianceToCheck((prev) => prev.concat(current.metadata.id));
    await startUploadAsync(picture, current);
  }, [sights, startUploadAsync]);

  const verifyComplianceStatus = useCallback((pictureId, compliances, currentId) => {
    // double check if the compliance is not invalid
    const hasTodoCompliances = Object.values(compliances).some((c) => hasTodo(c));
    if (!hasTodoCompliances) { return; }
    setTimeout(async () => { await checkComplianceAsync(pictureId, currentId); }, 500);
  }, [compliance.state]);

  const handleRecheck = useCallback((id) => {
    const payload = { id, status: 'idle', error: null, result: null, imageId: null, requestCount: 0 };
    compliance.dispatch({ type: Actions.compliance.UPDATE_COMPLIANCE, payload });
  }, [compliance]);

  useEffect(() => {
    // update the compliance queue
    const uploadsState = uploads.state;
    const complianceState = compliance.state;
    const toCheck = Object.values(uploadsState).find((uploadedImage) => uploadedImage.status === 'fulfilled' && complianceState[uploadedImage.id].status !== 'fulfilled');

    if (!toCheck) { return; }
    if (complianceState[toCheck?.id]?.requestCount > 1) { return; }

    setComplianceToCheck((prev) => prev.concat(toCheck.id));
  }, [uploads.state, compliance.state]);

  useEffect(() => {
    // run the compliance for all queue members
    const index = complianceToCheck.shift();
    const currentUploadState = uploads.state[index];
    const currentComplianceState = compliance.state[index];

    if (!index || !currentUploadState || !currentComplianceState) { return; }

    if (currentUploadState.status !== 'fulfilled') { return; }
    if (currentComplianceState.status !== 'idle') { return; }

    const pictureId = currentUploadState.pictureId;
    (async () => {
      const result = await checkComplianceAsync(pictureId, index);
      verifyComplianceStatus(pictureId, result.axiosResponse.data.compliances, index);
    })();
  }, [complianceToCheck, uploads.state, compliance.state]);

  return { handleReUpload, handleRetakeAll, handleRetake, handleRecheck };
}
