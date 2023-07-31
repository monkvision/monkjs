import { useCallback } from 'react';
import axios from 'axios';
import monk from '@monkvision/corejs';
import { Severity, RepairOperation } from '../../../resources';

function getSeverityLevel(severity) {
  switch (severity) {
    case Severity.LOW:
      return 1;
    case Severity.MEDIUM:
      return 2;
    case Severity.HIGH:
      return 3;
    default:
      return null;
  }
}

export default function useDamageAPI({ inspectionId }) {
  const createDamage = useCallback(({ part, pricing, severity, repairOperation }) => {
    const data = {
      label: part,
      ...(!!pricing && { pricing }),
      ...(!!severity && { level: getSeverityLevel(severity) }),
      ...(!!repairOperation && { repair_operation: repairOperation }),
    };
    return axios.request({
      ...monk.config.axiosConfig,
      method: 'post',
      url: `/inspections/${inspectionId}/severity_pricing`,
      data,
    });
  }, [inspectionId]);

  const updateDamage = useCallback(({ id, pricing, severity, repairOperation }) => {
    const data = {
      ...{ pricing: (!pricing ? null : pricing) },
      ...(!!severity && { level: getSeverityLevel(severity) }),
      ...(!!repairOperation && { repair_operation: repairOperation }),
    };
    return axios.request({
      ...monk.config.axiosConfig,
      method: 'patch',
      url: `/inspections/${inspectionId}/severity_pricing/${id}`,
      data,
    });
  }, [inspectionId]);

  const deleteDamage = useCallback((id) => axios.request({
    ...monk.config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/severity_pricing/${id}`,
    data: { level: 1, pricing: 0, repair_operation: RepairOperation.REPAIR },
  }), [inspectionId]);

  return {
    createDamage,
    updateDamage,
    deleteDamage,
  };
}
