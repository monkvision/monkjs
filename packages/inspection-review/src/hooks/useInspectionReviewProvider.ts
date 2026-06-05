import { createContext, useContext } from 'react';
import type { InspectionReviewProviderState } from '../types/inspection-review.types';

/**
 * Context to hold the state of the InspectionReviewProvider.
 */
export const InspectionReviewStateContext = createContext<InspectionReviewProviderState | null>(
  null,
);

/**
 * Custom hook to access the InspectionReviewProvider state.
 */
export function useInspectionReviewProvider(): InspectionReviewProviderState {
  const ctx = useContext(InspectionReviewStateContext);
  if (!ctx) {
    throw new Error(
      'useInspectionReviewProvider must be used inside InspectionReviewStateProvider',
    );
  }
  return ctx;
}
