import { useCallback, useMemo, useState } from 'react';

import { taskStatuses, taskNames } from '@monkvision/corejs';

export default function useLayout({ inspection }) {
  const isValidated = useMemo(
    () => inspection.tasks.find(
      (t) => t.name === taskNames.DAMAGE_DETECTION,
    ).status === taskStatuses.VALIDATED,
    [inspection.tasks],
  );

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDismissDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  return {
    isDialogOpen,
    handleOpenDialog,
    handleDismissDialog,
    isValidated,
  };
}
