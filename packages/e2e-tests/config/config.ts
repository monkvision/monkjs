import { EnvVar, defaults } from './defaults';

export function getEnvOrThrow(key: EnvVar): string {
  const value = process.env[key] ?? defaults[key];
  if (!value) {
    throw new Error(`No value found for the required configuration key ${key}.`);
  }
  return value;
}
