import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { VehicleModel } from '@monkvision/types';
import { loadJSON, MONK_DATA_PATH, readDir } from '../io';

interface SightForValidation {
  id: string;
  overlay: string;
  mirror_sight?: string;
}

type SightForValidationDictionary = {
  [id: string]: SightForValidation;
};

interface AdditionalValidationError {
  value: string;
}

interface VehicleFileNameError extends AdditionalValidationError {
  type: 'missingDir' | 'missingJson' | 'unknownDir' | 'unknownJson';
}

interface MirrorSightError extends AdditionalValidationError {
  type: 'missing' | 'invalid';
  mirrorId: string;
}

interface AdditionalValidationResults {
  vehicles: VehicleFileNameError[];
  mirrorSight: MirrorSightError[];
  missingOverlay: AdditionalValidationError[];
  minifiedOverlay: AdditionalValidationError[];
  unusedOverlay: AdditionalValidationError[];
}

function validateVehicleFileNames() {
  const results: VehicleFileNameError[] = [];
  const vehicles = Object.values(VehicleModel);
  vehicles.forEach((vehicle) => {
    if (!existsSync(join(MONK_DATA_PATH, vehicle))) {
      results.push({
        value: vehicle,
        type: 'missingDir',
      });
    } else if (!existsSync(join(MONK_DATA_PATH, vehicle, `${vehicle}.json`))) {
      results.push({
        value: vehicle,
        type: 'missingJson',
      });
    }
  });
  readDir(MONK_DATA_PATH).directories.forEach((vehicleDir) => {
    if (!(vehicles as string[]).includes(vehicleDir)) {
      results.push({
        value: vehicleDir,
        type: 'unknownDir',
      });
    } else {
      readDir(join(MONK_DATA_PATH, vehicleDir))
        .files.filter((fileName) => fileName !== `${vehicleDir}.json`)
        .filter((fileName) => fileName !== `${vehicleDir}.schema.json`)
        .forEach((fileName) => {
          results.push({
            value: `${vehicleDir}/${fileName}`,
            type: 'unknownJson',
          });
        });
    }
  });
  return results.sort((a, b) => a.type.localeCompare(b.type));
}

function validateMirrorSight(
  sight: SightForValidation,
  sights: SightForValidationDictionary,
): MirrorSightError | null {
  if (sight.mirror_sight && sights[sight.mirror_sight]?.mirror_sight !== sight.id) {
    return {
      type: !sights[sight.mirror_sight]?.mirror_sight ? 'missing' : 'invalid',
      value: sight.id,
      mirrorId: sight.mirror_sight,
    };
  }
  return null;
}

function validateMissingOverlays(
  sight: SightForValidation,
  overlayDirPath: string,
): AdditionalValidationError | null {
  if (!existsSync(join(overlayDirPath, sight.overlay))) {
    return { value: sight.id };
  }
  return null;
}

function validateMinifiedOverlays(
  sight: SightForValidation,
  overlayDirPath: string,
): AdditionalValidationError | null {
  const overlayPath = join(overlayDirPath, sight.overlay);
  if (existsSync(overlayPath)) {
    const svgStr = readFileSync(overlayPath).toString();
    if (['\n', '\r'].some((char) => svgStr.replace(/[\n\r]*$/, '').includes(char))) {
      return { value: sight.id };
    }
  }
  return null;
}

function validateUnusedOverlays(
  sights: SightForValidationDictionary,
  overlayDirPath: string,
): AdditionalValidationError[] {
  const errors: AdditionalValidationError[] = [];
  readDir(overlayDirPath).files.forEach((fileName) => {
    if (!Object.values(sights).find((sight) => sight.overlay === fileName)) {
      errors.push({ value: fileName });
    }
  });
  return errors;
}

function printResults(results: AdditionalValidationResults): boolean {
  let containsErrors = false;

  const errorDescriptionMap = {
    missingDir: 'Missing data directory.',
    missingJson: 'Missing JSON sights index.',
    unknownDir: 'Unknown vehicle data directory.',
    unknownJson: 'Unknown vehicle data set. Only the sights index and its schema are allowed here.',
  };

  if (results.vehicles.length > 0) {
    containsErrors = true;
    console.error('\n⚠️  Some JSON files are invalid or missing :');
    results.vehicles.forEach((error) => {
      console.error(`  - ${error.value} : ${errorDescriptionMap[error.type]}`);
    });
  }

  if (results.mirrorSight.length > 0) {
    containsErrors = true;
    console.error('\n⚠️  Some Sights contain invalid mirror sight ids :');
    results.mirrorSight.forEach((error) => {
      const errorDescription =
        error.type === 'missing'
          ? 'mirror_sight property is missing in the corresponding mirror sight'
          : 'the mirror_sight property defined in the corresponding mirror sight do not match';
      console.error(`  - ${error.value} : ${errorDescription} (mirror : ${error.mirrorId}).`);
    });
  }

  if (results.missingOverlay.length > 0) {
    containsErrors = true;
    console.error('\n⚠️  The following overlays are missing :');
    results.missingOverlay.forEach((error) => {
      console.error(`  - ${error.value}`);
    });
  }

  if (results.minifiedOverlay.length > 0) {
    containsErrors = true;
    console.error('\n⚠️  The following overlays are not minified :');
    results.minifiedOverlay.forEach((error) => {
      console.error(`  - ${error.value}`);
    });
  }

  if (results.unusedOverlay.length > 0) {
    containsErrors = true;
    console.error('\n⚠️  The following overlays are not used by any sight :');
    results.unusedOverlay.forEach((error) => {
      console.error(`  - ${error.value}`);
    });
  }

  return containsErrors;
}

export function validateAdditionalRules(print = true): void {
  const results: AdditionalValidationResults = {
    vehicles: validateVehicleFileNames(),
    mirrorSight: [],
    missingOverlay: [],
    minifiedOverlay: [],
    unusedOverlay: [],
  };

  readDir(MONK_DATA_PATH).directories.forEach((vehicle) => {
    const sights = loadJSON(
      join(MONK_DATA_PATH, vehicle, `${vehicle}.json`),
    ) as SightForValidationDictionary;
    const overlayDirPath = join(MONK_DATA_PATH, vehicle, 'overlays');
    Object.values(sights).forEach((sight) => {
      const mirrorSight = validateMirrorSight(sight, sights);
      if (mirrorSight) {
        results.mirrorSight.push(mirrorSight);
      }

      const missingOverlay = validateMissingOverlays(sight, overlayDirPath);
      if (missingOverlay) {
        results.missingOverlay.push(missingOverlay);
      }

      const minifiedOverlay = validateMinifiedOverlays(sight, overlayDirPath);
      if (minifiedOverlay) {
        results.minifiedOverlay.push(minifiedOverlay);
      }
    });
    const unusedOverlay = validateUnusedOverlays(sights, overlayDirPath);
    results.unusedOverlay = results.unusedOverlay.concat(unusedOverlay);
  });

  const containsErrors = Object.values(results).some(
    (errors: AdditionalValidationError[]) => errors.length > 0,
  );

  if (containsErrors) {
    if (print) {
      printResults(results);
    }
    throw new Error(
      'There were some errors during the additional validation steps. The error details have been logged above.',
    );
  }
}
