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

describe('Posthog Analytics Adapter instances', () => {
  const namedInstance = {
    setPersonProperties: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    capture: jest.fn(),
    register: jest.fn(),
    get_distinct_id: jest.fn(() => 'named-user-id'),
  };

  beforeEach(() => {
    (posthog.init as jest.Mock).mockImplementation((_token, _config, name) =>
      name ? namedInstance : undefined,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    (posthog.init as jest.Mock).mockReset();
    (posthog as any).__loaded = undefined;
    (posthog as any).config = undefined;
  });

  it('should use the global posthog instance when no instance name is given', () => {
    const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
    expect(posthog.init).toHaveBeenCalledWith(defaultConfiguration.token, {
      api_host: defaultConfiguration.api_host,
    });
    adapter.trackEvent('test');
    expect(posthog.capture).toHaveBeenCalledWith('test', undefined);
    expect(namedInstance.capture).not.toHaveBeenCalled();
  });

  it('should use a named posthog instance when an instance name is given', () => {
    const adapter = new PosthogAnalyticsAdapter({
      ...defaultConfiguration,
      instanceName: 'secondary',
    });
    expect(posthog.init).toHaveBeenCalledWith(
      defaultConfiguration.token,
      { api_host: defaultConfiguration.api_host },
      'secondary',
    );
    expect(namedInstance.setPersonProperties).toHaveBeenCalledWith({
      environnement: defaultConfiguration.environnement,
      projectName: defaultConfiguration.projectName,
      release: defaultConfiguration.release,
    });

    adapter.setUserId('id', { a: 1 });
    adapter.setUserProperties({ b: 2 });
    adapter.resetUser();
    adapter.trackEvent('event', { c: 3 });
    adapter.setEventsProperties({ d: 4 });
    expect(adapter.getUserId()).toEqual('named-user-id');

    expect(namedInstance.identify).toHaveBeenCalledWith('id', { a: 1 });
    expect(namedInstance.setPersonProperties).toHaveBeenCalledWith({ b: 2 });
    expect(namedInstance.reset).toHaveBeenCalled();
    expect(namedInstance.capture).toHaveBeenCalledWith('event', { c: 3 });
    expect(namedInstance.register).toHaveBeenCalledWith({ d: 4 });
    expect(posthog.identify).not.toHaveBeenCalled();
    expect(posthog.capture).not.toHaveBeenCalled();
    expect(posthog.register).not.toHaveBeenCalled();
    expect(posthog.reset).not.toHaveBeenCalled();
  });

  it('should create a named instance if the global one is already used by another project', () => {
    (posthog as any).__loaded = true;
    (posthog as any).config = { token: 'phc_other_token' };
    const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
    expect(posthog.init).toHaveBeenCalledWith(
      defaultConfiguration.token,
      { api_host: defaultConfiguration.api_host },
      `monk-${defaultConfiguration.token}`,
    );
    adapter.trackEvent('test');
    expect(namedInstance.capture).toHaveBeenCalledWith('test', undefined);
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it('should keep using the global instance if it is already used by the same project', () => {
    (posthog as any).__loaded = true;
    (posthog as any).config = { token: defaultConfiguration.token };
    const adapter = new PosthogAnalyticsAdapter(defaultConfiguration);
    expect(posthog.init).toHaveBeenCalledWith(defaultConfiguration.token, {
      api_host: defaultConfiguration.api_host,
    });
    adapter.trackEvent('test');
    expect(posthog.capture).toHaveBeenCalledWith('test', undefined);
  });

  it('should fall back to the global instance if posthog does not return a named instance', () => {
    (posthog.init as jest.Mock).mockImplementation(() => undefined);
    const adapter = new PosthogAnalyticsAdapter({ ...defaultConfiguration, instanceName: 'x' });
    adapter.trackEvent('test');
    expect(posthog.capture).toHaveBeenCalledWith('test', undefined);
  });
});
