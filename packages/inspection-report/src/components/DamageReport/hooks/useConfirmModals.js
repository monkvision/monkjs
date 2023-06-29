import { useState, useCallback } from 'react';

export const ConfirmModals = {
  Validate: {
    message: 'damageReport.modals.validate.message',
    yes: 'damageReport.modals.validate.yes',
    cancel: 'damageReport.modals.validate.cancel',
  },
  ValidateWithPDF: {
    message: 'damageReport.modals.validateWithPDF.message',
    yes: 'damageReport.modals.validateWithPDF.yes',
    cancel: 'damageReport.modals.validateWithPDF.cancel',
  },
  NewInspection: {
    message: 'damageReport.modals.newInspection.message',
    yes: 'damageReport.modals.newInspection.yes',
    cancel: 'damageReport.modals.newInspection.cancel',
  },
};

export default function useConfirmModals({
  generatePdf,
  requestPdf,
  setIsEditable,
  onStartNewInspection,
}) {
  const [confirmModal, setConfirmModal] = useState(null);
  const showConfirmModal = useCallback((modal) => setConfirmModal(modal), []);
  const hideConfirmModal = useCallback(() => setConfirmModal(null), []);

  const handleValidateInspection = useCallback(() => {
    showConfirmModal({
      texts: generatePdf ? ConfirmModals.ValidateWithPDF : ConfirmModals.Validate,
      onConfirm: () => {
        setIsEditable(false);
        requestPdf().then(() => {});
        hideConfirmModal();
      },
    });
  }, [setIsEditable, generatePdf, requestPdf, hideConfirmModal]);

  const handleNewInspection = useCallback(() => {
    showConfirmModal({
      texts: ConfirmModals.NewInspection,
      onConfirm: () => {
        hideConfirmModal();
        onStartNewInspection();
      },
    });
  }, [onStartNewInspection]);

  return {
    confirmModal,
    handleHideConfirmModal: hideConfirmModal,
    handleValidateInspection,
    handleNewInspection,
  };
}
