/**
 * Utility function that returns the value of a given environment variable. If the value does not exist, it throws an
 * error.
 */
export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not defined.`);
  }
  return value;
}
