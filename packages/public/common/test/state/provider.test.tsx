import {
  Damage,
  Image,
  Inspection,
  MonkEntity,
  MonkEntityType,
  Part,
  PartOperation,
  SeverityResult,
  Task,
  Vehicle,
  WheelAnalysis,
} from '@monkvision/types';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  MonkActionType,
  createEmptyMonkState,
  MonkGotOneAction,
  MonkProvider,
  MonkState,
  useMonkState,
} from '../../src';

const testId = 'test-id';

function display(entities?: MonkEntity[]): string {
  return entities ? JSON.stringify(entities.map((e) => e.id)) : 'unknown';
}

function createState(id: string): MonkState {
  return {
    damages: [{ id: `test-damage-${id}` } as Damage],
    images: [{ id: `test-image-${id}` } as Image],
    inspections: [{ id: `test-inspection-${id}` } as Inspection],
    parts: [{ id: `test-part-${id}` } as Part],
    partOperations: [{ id: `test-part-operation-${id}` } as PartOperation],
    severityResults: [{ id: `test-severity-result-${id}` } as SeverityResult],
    tasks: [{ id: `test-tasks-${id}` } as Task],
    vehicles: [{ id: `test-vehicle-${id}` } as Vehicle],
    wheelAnalysis: [{ id: `test-wheel-analysis-${id}` } as WheelAnalysis],
  };
}

function assertState(state: MonkState): void {
  expect(screen.getByTestId('damages').textContent).toEqual(display(state.damages));
  expect(screen.getByTestId('images').textContent).toEqual(display(state.images));
  expect(screen.getByTestId('inspections').textContent).toEqual(display(state.inspections));
  expect(screen.getByTestId('parts').textContent).toEqual(display(state.parts));
  expect(screen.getByTestId('part-operations').textContent).toEqual(display(state.partOperations));
  expect(screen.getByTestId('severity-results').textContent).toEqual(
    display(state.severityResults),
  );
  expect(screen.getByTestId('tasks').textContent).toEqual(display(state.tasks));
  expect(screen.getByTestId('vehicles').textContent).toEqual(display(state.vehicles));
  expect(screen.getByTestId('wheel-analysis').textContent).toEqual(display(state.wheelAnalysis));
}

function TestComponent() {
  const { state, dispatch } = useMonkState();

  const handleDispatch = () => {
    const action: MonkGotOneAction<Inspection> = {
      type: MonkActionType.GOT_ONE_ENTITY,
      entityType: MonkEntityType.INSPECTION,
      entity: { id: testId } as Inspection,
    };
    dispatch(action);
  };
  return (
    <div>
      <button data-testid='dispatch-test' onClick={handleDispatch}>
        dispatch
      </button>
      <div data-testid='damages'>{display(state.damages)}</div>
      <div data-testid='images'>{display(state.images)}</div>
      <div data-testid='inspections'>{display(state.inspections)}</div>
      <div data-testid='parts'>{display(state.parts)}</div>
      <div data-testid='part-operations'>{display(state.partOperations)}</div>
      <div data-testid='severity-results'>{display(state.severityResults)}</div>
      <div data-testid='tasks'>{display(state.tasks)}</div>
      <div data-testid='vehicles'>{display(state.vehicles)}</div>
      <div data-testid='wheel-analysis'>{display(state.wheelAnalysis)}</div>
    </div>
  );
}

describe('MonkProvider component', () => {
  it('should initialize the MonkContext with empty values', () => {
    const { unmount } = render(
      <MonkProvider>
        <TestComponent />
      </MonkProvider>,
    );

    assertState(createEmptyMonkState());
    unmount();
  });

  it('should initialize the MonkContext with an initial value', () => {
    const initialState = createState('test-1');
    const { unmount } = render(
      <MonkProvider initialState={initialState}>
        <TestComponent />
      </MonkProvider>,
    );

    assertState(initialState);
    unmount();
  });

  it('should provide a valid dispatch function', async () => {
    const { unmount } = render(
      <MonkProvider>
        <TestComponent />
      </MonkProvider>,
    );

    fireEvent.click(screen.getByTestId('dispatch-test'));

    const state = createEmptyMonkState();
    state.inspections.push({ id: testId } as Inspection);
    assertState(state);
    unmount();
  });

  it('should not initialize a state if it is already defined', async () => {
    const state1 = createState('test-1');
    const state2 = createState('test-2');
    const { unmount } = render(
      <MonkProvider initialState={state1}>
        <MonkProvider initialState={state2}>
          <TestComponent />
        </MonkProvider>
      </MonkProvider>,
    );

    assertState(state1);
    unmount();
  });
});
