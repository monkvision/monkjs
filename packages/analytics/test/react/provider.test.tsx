import { fireEvent, render, screen } from '@testing-library/react';
import { AnalyticsAdapter, AnalyticsProvider, useAnalytics } from '../../src';

function TestComponent() {
  const { setUserId, setUserProperties, trackEvent, resetUser, setEventsProperties } =
    useAnalytics();

  return (
    <div>
      <button data-testid='set-user-id-btn' onClick={() => setUserId('test')}>
        setUserId
      </button>
      <button
        data-testid='set-user-properties-btn'
        onClick={() => setUserProperties({ test: 'test' })}
      >
        setUserProperties
      </button>
      <button data-testid='reset-user-btn' onClick={() => resetUser()}>
        reset
      </button>
      <button
        data-testid='track-event-btn'
        onClick={() => trackEvent('test event', { test: 'test' })}
      >
        trackEvent
      </button>
      <button
        data-testid='set-events-properties-btn'
        onClick={() => setEventsProperties({ test: 'test' })}
      >
        trackEvent
      </button>
    </div>
  );
}

describe('AnalyticsProvider component', () => {
  it('should initialize the AnalyticsContext with the given adapter', () => {
    const adapter: AnalyticsAdapter = {
      setUserId: jest.fn(),
      setUserProperties: jest.fn(),
      resetUser: jest.fn(),
      trackEvent: jest.fn(),
      setEventsProperties: jest.fn(),
    };
    const setUserIdSpy = jest.spyOn(adapter, 'setUserId');
    const setUserPropertiesSpy = jest.spyOn(adapter, 'setUserProperties');
    const resetUserSpy = jest.spyOn(adapter, 'resetUser');
    const trackEventSpy = jest.spyOn(adapter, 'trackEvent');
    const setEventsPropertiesSpy = jest.spyOn(adapter, 'setEventsProperties');

    const { unmount } = render(
      <AnalyticsProvider adapter={adapter}>
        <TestComponent />
      </AnalyticsProvider>,
    );

    fireEvent.click(screen.getByTestId('set-user-id-btn'));
    expect(setUserIdSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('set-user-properties-btn'));
    expect(setUserPropertiesSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('reset-user-btn'));
    expect(resetUserSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('track-event-btn'));
    expect(trackEventSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('set-events-properties-btn'));
    expect(setEventsPropertiesSpy).toHaveBeenCalledTimes(1);
    unmount();
  });
});
