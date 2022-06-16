import * as browserify from '@cypress/browserify-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { preprocessor } from '@badeball/cypress-cucumber-preprocessor/browserify';
import { EnvVar, getEnvOrThrow } from '../../config';

export default async (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> => {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    preprocessor(config, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...browserify.defaultOptions,
      typescript: require.resolve('typescript'),
    }),
  );

  Object.values(EnvVar).forEach((envVar) => {
    // eslint-disable-next-line no-param-reassign
    config.env[envVar] = getEnvOrThrow(envVar);
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
};
