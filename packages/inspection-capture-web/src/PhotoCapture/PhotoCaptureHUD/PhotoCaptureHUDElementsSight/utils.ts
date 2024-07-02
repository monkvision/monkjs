import { CSSProperties } from 'react';

export function getVisilityStyle(enable?: boolean): CSSProperties {
  return { visibility: enable ? 'visible' : 'hidden' };
}
