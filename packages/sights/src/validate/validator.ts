import { join } from 'path';
import Ajv2020 from 'ajv/dist/2020';
import { loadJSON, MONK_DATA_PATH, readDir } from '../io';
import { loadSchemas } from './schemas';

const SCHEMA_KEY_LABELS = 'labels';
const SCHEMA_KEY_VEHICLES = 'vehicles';

export class JSONValidator {
  private ajv: Ajv2020;

  constructor() {
    this.ajv = new Ajv2020({
      allErrors: true,
      schemas: loadSchemas(),
    });
  }

  public validateAllFiles(): void {
    this.validate(join(MONK_DATA_PATH, 'labels.json'), SCHEMA_KEY_LABELS);
    this.validate(join(MONK_DATA_PATH, 'vehicles.json'), SCHEMA_KEY_VEHICLES);
    this.validateVehicleSights();
  }

  private validate(path: string, schemaKey: string): void {
    const data = loadJSON(path);
    const validateFn = this.ajv.getSchema(schemaKey);
    if (!validateFn) {
      throw new Error(`Unable to load schema with key ${schemaKey}.`);
    }
    if (!validateFn(data)) {
      console.error(validateFn.errors);
      throw new Error(
        `JSON Schema validation failed for ${path}. The validation errors were logged above this message.`,
      );
    }
  }

  private validateVehicleSights(): void {
    readDir(MONK_DATA_PATH).directories.forEach((vehicle) => {
      this.validate(join(MONK_DATA_PATH, vehicle, `${vehicle}.json`), vehicle);
    });
  }
}
