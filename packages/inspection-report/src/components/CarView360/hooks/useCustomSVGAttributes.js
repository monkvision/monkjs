import { useMemo } from 'react';

import { CarParts } from '../../../resources';
import { getPillDamage, isPricingPill } from './common';

const styles = {
  hidden: { display: 'none' },
  pill: { cursor: 'pointer' },
  pillChild: { cursor: 'pointer' },
};

function isPillHidden({ pillId, damage }) {
  const isPricing = isPricingPill(pillId);
  const damageModeHidden = isPricing
    ? damage?.pricing === undefined
    : damage?.pricing !== undefined;
  return !damage || damageModeHidden;
}

function getCustomPillAttributes({ damages, elementId }) {
  const { damage } = getPillDamage({ damages, pillId: elementId });

  if (isPillHidden({ pillId: elementId, damage })) {
    return { style: styles.hidden };
  }

  return { style: styles.pill };
}

function getCustomPillChildAttributes({ damages, groupId, elementClass, onPressPill }) {
  const { part, damage } = getPillDamage({ damages, pillId: groupId });

  if (isPillHidden({ pillId: groupId, damage })) {
    return { style: styles.hidden };
  }

  if (elementClass.includes('severity-low') && damage?.severity !== 'low') {
    return { style: styles.hidden };
  }

  if (elementClass.includes('severity-medium') && damage?.severity !== 'medium') {
    return { style: styles.hidden };
  }

  if (elementClass.includes('severity-high') && damage?.severity !== 'high') {
    return { style: styles.hidden };
  }

  if (elementClass.includes('severity-none') && damage?.severity !== undefined) {
    return { style: styles.hidden };
  }

  const onClick = () => onPressPill(part);

  return {
    pointerEvents: 'all',
    style: styles.pillChild,
    onClick,
  };
}

export default function useCustomSVGAttributes({
  element,
  groupId,
  damages,
  getPartAttributes,
  onPressPart,
  onPressPill,
}) {
  return useMemo(() => {
    const elementId = element.getAttribute('id');
    const elementClass = element.getAttribute('class');
    const elementTag = element.tagName;

    if (['svg', 'g'].includes(elementTag)) {
      return { pointerEvents: 'box-none' };
    }

    if (elementId && elementId.startsWith('damage-pill')) {
      return getCustomPillAttributes({
        damages,
        elementId,
      });
    }

    if (groupId && groupId.startsWith('damage-pill')) {
      return getCustomPillChildAttributes({
        damages,
        groupId,
        elementClass,
        onPressPill,
      });
    }

    let part = null;

    if (groupId && CarParts.includes(groupId)) {
      part = groupId;
    }

    if (elementClass && elementClass.includes('car-part') && elementClass.includes('selectable') && CarParts.includes(elementId)) {
      part = elementId;
    }

    if (part) {
      const partAttributes = getPartAttributes(part) ?? {};
      const onClick = () => onPressPart(part);

      return {
        pointerEvents: 'all',
        onClick,
        ...partAttributes,
      };
    }

    return {};
  }, [
    element,
    groupId,
    damages,
    getPartAttributes,
    onPressPart,
    onPressPill,
  ]);
}
