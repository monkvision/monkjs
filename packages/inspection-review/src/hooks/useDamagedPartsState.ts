import { useMemo } from 'react';
import { DamageType, Part } from '@monkvision/types';
import { useMonkState, useObjectMemo } from '@monkvision/common';
import {
  getChildPartsForAggregation,
  isChildPartForAggregation,
} from '../utils/partAggregation.utils';
import { DamagedPartDetails, InspectionReviewProps } from '../types';

/**
 * Props for the useDamagedPartsState hook.
 */
export type DamagedPartsProps = Pick<InspectionReviewProps, 'inspectionId'>;

/**
 * Hook to retrieve the damaged parts details for a given inspection.
 */
export default function useDamagedPartsState({ inspectionId }: DamagedPartsProps) {
  const { state } = useMonkState();

  function getPartDamageDetails(partId: string, inspectionParts: Part[]) {
    const part = inspectionParts.find((p) => p.id === partId);
    if (!part) {
      return { damageTypes: [], pricing: undefined };
    }

    const damageTypes: DamageType[] = part.damages.reduce<DamageType[]>((acc, damageId) => {
      const damage = state.damages.find((value) => value.id === damageId)?.type;
      if (damage) {
        acc.push(damage);
      }
      return acc;
    }, []);

    const pricingObj = state.pricings.find((price) => price.relatedItemId === part.id);
    const pricing = pricingObj?.pricing;

    return { damageTypes, pricing };
  }

  const damagedPartsDetails = useMemo(() => {
    const inspectionParts = state.parts.filter((part) => part.inspectionId === inspectionId);

    const parts: DamagedPartDetails[] = inspectionParts
      .filter((part) => !isChildPartForAggregation(part.type))
      .map((part) => {
        const { damageTypes, pricing } = getPartDamageDetails(part.id, inspectionParts);
        const childPartTypes = getChildPartsForAggregation(part.type);

        const aggregatedDamageTypes = [...damageTypes];
        let aggregatedPricing = pricing;

        childPartTypes.forEach((childPartType) => {
          const childPart = inspectionParts.find((p) => p.type === childPartType);

          if (childPart) {
            const childDetails = getPartDamageDetails(childPart.id, inspectionParts);

            childDetails.damageTypes.forEach((dt) => {
              if (!aggregatedDamageTypes.includes(dt)) {
                aggregatedDamageTypes.push(dt);
              }
            });

            if (childDetails.pricing !== undefined) {
              aggregatedPricing = (aggregatedPricing ?? 0) + childDetails.pricing;
            }
          }
        });

        return {
          part: part.type,
          damageTypes: aggregatedDamageTypes,
          pricing: aggregatedPricing,
          isDamaged: aggregatedDamageTypes.length > 0,
        };
      });

    return parts;
  }, [state, inspectionId]);

  return useObjectMemo({ damagedPartsDetails });
}
