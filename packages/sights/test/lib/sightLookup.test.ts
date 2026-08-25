import { VehicleModel } from '@monkvision/types';
import {
  getEnglishLabelForSightId,
  getLabelKeyForSightId,
  getLabelKeyFromName,
  getSightIdsByLabelForVehicle,
  normalizeLabelInput,
  resolveNamesFromSightIds,
  resolveSightIdsFromNames,
} from '../../src/lib/sightLookup';

describe('normalizeLabelInput', () => {
  it('should lower-case, trim and hyphenate the input', () => {
    expect(normalizeLabelInput('  Front   low ')).toBe('front-low');
    expect(normalizeLabelInput('Hood')).toBe('hood');
  });
});

describe('getLabelKeyFromName', () => {
  it('should resolve a human-readable name to its label key', () => {
    expect(getLabelKeyFromName('Front low')).toBe('front-low');
    expect(getLabelKeyFromName('hood')).toBe('hood');
  });

  it('should return undefined for an unknown name', () => {
    expect(getLabelKeyFromName('Front left')).toBeUndefined();
  });
});

describe('getSightIdsByLabelForVehicle', () => {
  it('should return every sight ID matching the label for the vehicle model', () => {
    expect(getSightIdsByLabelForVehicle('front-low', VehicleModel.HACCORD)).toEqual([
      'haccord-8YjMcu0D',
    ]);
    expect(getSightIdsByLabelForVehicle('front-lateral-low-left', VehicleModel.HACCORD)).toEqual(
      expect.arrayContaining(['haccord-GQcZz48C']),
    );
  });

  it('should return an empty array when no sight matches', () => {
    expect(getSightIdsByLabelForVehicle('unknown-label', VehicleModel.HACCORD)).toEqual([]);
  });
});

describe('resolveSightIdsFromNames', () => {
  it('should resolve a list of human-readable names to sight IDs for the vehicle model', () => {
    const results = resolveSightIdsFromNames(['Front low', 'Hood'], VehicleModel.HACCORD);
    expect(results).toEqual([
      {
        input: 'Front low',
        labelKey: 'front-low',
        sightIds: ['haccord-8YjMcu0D'],
        ambiguous: false,
      },
      { input: 'Hood', labelKey: 'hood', sightIds: ['haccord-DUPnw5jj'], ambiguous: false },
    ]);
  });

  it('should flag ambiguous labels while still returning every matching sight ID', () => {
    const [result] = resolveSightIdsFromNames(['Front lateral low left'], VehicleModel.HACCORD);
    expect(result.error).toBeUndefined();
    expect(result).toMatchObject({ labelKey: 'front-lateral-low-left', ambiguous: false });
    expect((result as { sightIds: string[] }).sightIds).toEqual(
      expect.arrayContaining(['haccord-GQcZz48C']),
    );
  });

  it('should report an unknown-label error for an unmatched name', () => {
    const [result] = resolveSightIdsFromNames(['Front left'], VehicleModel.HACCORD);
    expect(result).toEqual({ input: 'Front left', error: 'unknown-label' });
  });

  it('should report a no-sight-for-vehicle error when the label has no sight for this vehicle', () => {
    const [result] = resolveSightIdsFromNames(['Dashboard from back seat'], VehicleModel.HACCORD);
    expect(result).toEqual({
      input: 'Dashboard from back seat',
      labelKey: 'dashboard-from-back-seat',
      error: 'no-sight-for-vehicle',
    });
  });
});

describe('getLabelKeyForSightId', () => {
  it('should return the label key of a known sight ID', () => {
    expect(getLabelKeyForSightId('haccord-8YjMcu0D')).toBe('front-low');
  });

  it('should return undefined for an unknown sight ID', () => {
    expect(getLabelKeyForSightId('unknown-id')).toBeUndefined();
  });
});

describe('getEnglishLabelForSightId', () => {
  it('should return the English label of a known sight ID', () => {
    expect(getEnglishLabelForSightId('haccord-8YjMcu0D')).toBe('Front Low');
  });

  it('should return undefined for an unknown sight ID', () => {
    expect(getEnglishLabelForSightId('unknown-id')).toBeUndefined();
  });
});

describe('resolveNamesFromSightIds', () => {
  it('should resolve a list of sight IDs to their label information', () => {
    const results = resolveNamesFromSightIds(['haccord-8YjMcu0D', 'haccord-DUPnw5jj']);
    expect(results).toEqual([
      { sightId: 'haccord-8YjMcu0D', labelKey: 'front-low', englishLabel: 'Front Low' },
      { sightId: 'haccord-DUPnw5jj', labelKey: 'hood', englishLabel: 'Hood' },
    ]);
  });

  it('should report an unknown-sight-id error for an unknown sight ID', () => {
    const [result] = resolveNamesFromSightIds(['unknown-id']);
    expect(result).toEqual({ sightId: 'unknown-id', error: 'unknown-sight-id' });
  });
});
