jest.mock('posthog-js');

import posthog from 'posthog-js';
import { PosthogAnalyticsAdapter } from '../src';

const defaultConfiguration = {
  token: 'phc_iNzK7jyK2bLtRi9vNWnzQqy74rIPlXPdgGs0qgJrSfL',
  api_host: 'https://eu.posthog.com',
  environnement: 'test',
  projectName: 'test',
  release: '1.0',
};

describe('Posthog Analytics Adapter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserId function', () => {
    it('should set a user id in posthog', () => {
      const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
      adapter.setUserId('test id', { token: 'test' });
      expect(posthog.identify).toHaveBeenCalledWith('test id', { token: 'test' });
    });
  });

  describe('setUserProperties function', () => {
    it('should set a user properties in posthog', () => {
      const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
      adapter.setUserProperties({ test: 'test properties' });
      expect(posthog.setPersonProperties).toHaveBeenCalledWith({ test: 'test properties' });
    });
  });

  describe('reset function', () => {
    it('should reset the user in posthog', () => {
      const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
      adapter.resetUser();
      expect(posthog.reset).toHaveBeenCalled();
    });
  });

  describe('trackEvent function', () => {
    it('should set a user properties in posthog', () => {
      const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
      adapter.trackEvent('test', { test: 'test properties' });
      expect(posthog.capture).toHaveBeenCalledWith('test', { test: 'test properties' });
    });
  });

  describe('setEventsProperties function', () => {
    it('should set events properties in posthog', () => {
      const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
      adapter.setEventsProperties({ test: 'test properties' });
      expect(posthog.register).toHaveBeenCalledWith({ test: 'test properties' });
    });
  });
});
