import { useCallback, useState } from 'react';

export default function usePartSelector() {
  const [selectedParts, setSelectedParts] = useState([]);

  const isPartSelected = useCallback((part) => selectedParts.includes(part), [selectedParts]);

  const togglePart = useCallback((part) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([part, ...selectedParts]);
    }
  }, [selectedParts, setSelectedParts]);

  return {
    isPartSelected,
    togglePart,
    selectedParts,
  };
}
