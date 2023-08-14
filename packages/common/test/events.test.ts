import { mergeEventHandlers, MonkEventHandlers } from '../src';

interface TestEventHandlers extends MonkEventHandlers {
  onEventOne?: (value: string) => unknown;
  onEventTwo?: (value: number) => unknown;
}

describe('mergeEventHandlers function', () => {
  it('should merge multiple event handlers into a single one', () => {
    const handlers1: TestEventHandlers = {
      onEventOne: jest.fn(),
      onEventTwo: jest.fn(),
    };
    const handlers2: TestEventHandlers = { onEventOne: jest.fn() };
    const handlers3: TestEventHandlers = { onEventTwo: jest.fn() };
    const eventOneSpies = [
      jest.spyOn(handlers1, 'onEventOne'),
      jest.spyOn(handlers2, 'onEventOne'),
    ];
    const eventTwoSpies = [
      jest.spyOn(handlers1, 'onEventTwo'),
      jest.spyOn(handlers3, 'onEventTwo'),
    ];

    const mergedHandlers = mergeEventHandlers([handlers1, handlers2, handlers3]);

    expect(typeof mergedHandlers.onEventOne).toBe('function');
    expect(typeof mergedHandlers.onEventTwo).toBe('function');
    const onEventOne = mergedHandlers.onEventOne as (value: string) => unknown;
    const onEventTwo = mergedHandlers.onEventTwo as (value: number) => unknown;

    const eventOneValue = 'test value';
    const eventTwoValue = 34;
    onEventOne(eventOneValue);
    onEventTwo(eventTwoValue);

    expect(eventOneSpies[0]).toHaveBeenCalledWith(eventOneValue);
    expect(eventOneSpies[1]).toHaveBeenCalledWith(eventOneValue);
    expect(eventTwoSpies[0]).toHaveBeenCalledWith(eventTwoValue);
    expect(eventTwoSpies[1]).toHaveBeenCalledWith(eventTwoValue);
  });
});
