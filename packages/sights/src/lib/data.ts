import {
  LabelDictionary,
  SightDictionary,
  VehicleDictionary,
  WireFrameDictionary,
} from '@monkvision/types';
// @ts-ignore
import labelsJSON from './data/labels.json';
// @ts-ignore
import wireFrameJSON from './data/wireframes.json';
// @ts-ignore
import vehiclesJSON from './data/vehicles.json';
// @ts-ignore
import allSightsJSON from './data/sights/all.json';
// @ts-ignore
import audia7SightsJSON from './data/sights/audia7.json';
// @ts-ignore
import fesc20SightsJSON from './data/sights/fesc20.json';
// @ts-ignore
import ff150SightsJSON from './data/sights/ff150.json';
// @ts-ignore
import ffocus18SightsJSON from './data/sights/ffocus18.json';
// @ts-ignore
import ftransit18SightsJSON from './data/sights/ftransit18.json';
// @ts-ignore
import haccordSightsJSON from './data/sights/haccord.json';
// @ts-ignore
import jgc21SightsJSON from './data/sights/jgc21.json';
// @ts-ignore
import tsienna20SightsJSON from './data/sights/tsienna20.json';
// @ts-ignore
import vwtrocSightsJSON from './data/sights/vwtroc.json';

/**
 * Object map associating translation keys to sight labels translations.
 */
const labels = labelsJSON as LabelDictionary;

/**
 * Object map associating vehicle type keys to vehicle details.
 */
const vehicles = vehiclesJSON as VehicleDictionary;

/**
 * Object map associating sight IDs to the sight details.
 */
const sights = {
  ...allSightsJSON,
  ...audia7SightsJSON,
  ...fesc20SightsJSON,
  ...ff150SightsJSON,
  ...ffocus18SightsJSON,
  ...ftransit18SightsJSON,
  ...haccordSightsJSON,
  ...jgc21SightsJSON,
  ...tsienna20SightsJSON,
  ...vwtrocSightsJSON,
} as SightDictionary;

/**
 * associating vehicle models to part selection wire frames if it present.
 */
const wireFrame: WireFrameDictionary = wireFrameJSON;

export { labels, sights, vehicles, wireFrame };
