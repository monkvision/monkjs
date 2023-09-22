import { useMemo } from 'react';
import { SVGElementCustomProps } from './propTypes';

/**
 * Custom hook used to generate the group IDs for the children elements of an SVGElement component.
 */
export function useChildrenGroupIds({
  element,
  groupIds,
}: Required<SVGElementCustomProps>): string[] {
  return useMemo(() => {
    const id = element.getAttribute('id');
    return element.tagName === 'g' && id ? [...groupIds, id] : groupIds;
  }, [element, groupIds]);
}
