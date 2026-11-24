import { AnalyticsAdapter, CompositeAnalyticsAdapter } from '../../src';

function createMockAdapter(userId = 'user-id'): AnalyticsAdapter {
  return {
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
    resetUser: jest.fn(),
    trackEvent: jest.fn(),
    setEventsProperties: jest.fn(),
    getUserId: jest.fn(() => userId),
  };
}

describe('CompositeAnalyticsAdapter', () => {
  it('should throw if no adapter is given', () => {
    expect(() => new CompositeAnalyticsAdapter([])).toThrow();
  });

  it('should forward every call to all the adapters', () => {
    const adapters = [createMockAdapter(), createMockAdapter()];
    const composite = new CompositeAnalyticsAdapter(adapters);

    composite.setUserId('id', { a: 1 });
    composite.setUserProperties({ b: 2 });
    composite.resetUser();
    composite.trackEvent('event', { c: 3 });
    composite.setEventsProperties({ d: 4 });

    adapters.forEach((adapter) => {
      expect(adapter.setUserId).toHaveBeenCalledWith('id', { a: 1 });
      expect(adapter.setUserProperties).toHaveBeenCalledWith({ b: 2 });
      expect(adapter.resetUser).toHaveBeenCalledTimes(1);
      expect(adapter.trackEvent).toHaveBeenCalledWith('event', { c: 3 });
      expect(adapter.setEventsProperties).toHaveBeenCalledWith({ d: 4 });
    });
  });

  it('should not be affected by changes made to the given array', () => {
    const adapters = [createMockAdapter()];
    const composite = new CompositeAnalyticsAdapter(adapters);
    const added = createMockAdapter();
    adapters.push(added);
    composite.trackEvent('event');
    expect(added.trackEvent).not.toHaveBeenCalled();
  });

  it('should return the user ID of the primary adapter', () => {
    const adapters = [createMockAdapter('primary'), createMockAdapter('secondary')];
    const composite = new CompositeAnalyticsAdapter(adapters);
    expect(composite.getUserId()).toEqual('primary');
    expect(adapters[1].getUserId).not.toHaveBeenCalled();
  });

  it('should call every adapter even if one throws, then rethrow the first error', () => {
    const firstError = new Error('first');
    const adapters = [createMockAdapter(), createMockAdapter(), createMockAdapter()];
    (adapters[0].trackEvent as jest.Mock).mockImplementation(() => {
      throw firstError;
    });
    (adapters[1].trackEvent as jest.Mock).mockImplementation(() => {
      throw new Error('second');
    });
    const composite = new CompositeAnalyticsAdapter(adapters);

    expect(() => composite.trackEvent('event')).toThrow(firstError);
    adapters.forEach((adapter) =>
      expect(adapter.trackEvent).toHaveBeenCalledWith('event', undefined),
    );
  });
});
