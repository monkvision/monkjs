import { useCallback } from 'react';
import axios from 'axios';
import monk from '@monkvision/corejs';
import { Severity } from '../../../resources';

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
  const createDamage = useCallback(({ part, pricing, severity }) => {
    const data = {
      label: part,
      ...(!!pricing && { pricing }),
      ...(!!severity && { level: getSeverityLevel(severity) }),
    };
    return axios.request({
      ...monk.config.axiosConfig,
      method: 'post',
      url: `/inspections/${inspectionId}/severity_pricing`,
      data,
    });
  }, [inspectionId]);

  const updateDamage = useCallback(({ id, pricing, severity }) => {
    const data = {
      ...(!!pricing && { pricing }),
      ...(!!severity && { level: getSeverityLevel(severity) }),
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
    data: { pricing: 0 },
  }), [inspectionId]);

  return {
    createDamage,
    updateDamage,
    deleteDamage,
  };
}
