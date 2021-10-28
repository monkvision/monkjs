import { sights } from '@monkvision/corejs';
import noop from 'lodash.noop';

export const Listeners = {
  onError: noop,
  onStart: noop,
  onSuccess: noop,
};

export const Sights = sights.combos.withInterior;
