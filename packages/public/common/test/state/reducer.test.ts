import {
  Image,
  Inspection,
  MonkEntityType,
  PartOperation,
  SeverityResult,
  Task,
  Vehicle,
  WheelAnalysis,
} from '@monkvision/types';
import {
  MonkActionType,
  createEmptyMonkState,
  MonkGotOneAction,
  monkReducer,
  MonkGotManyAction,
  MonkDeletedOneAction,
  MonkDeletedManyAction,
} from '../../src';

describe('Monk reducer function', () => {
  it('should create a new entity after a GOT_ONE dispatch', () => {
    const inspection = { id: 'test-id' } as Inspection;
    const action: MonkGotOneAction<Inspection> = {
      type: MonkActionType.GOT_ONE_ENTITY,
      entityType: MonkEntityType.INSPECTION,
      entity: inspection,
    };
    const result = monkReducer(createEmptyMonkState(), action);

    const expected = createEmptyMonkState();
    expected.inspections.push(inspection);
    expect(result).toEqual(expected);
  });

  it('should update an existing entity after a GOT_ONE dispatch', () => {
    const id = 'test-id';
    const state = createEmptyMonkState();
    state.images.push({ id, url: 'url-1' } as Image);
    const action: MonkGotOneAction<Image> = {
      type: MonkActionType.GOT_ONE_ENTITY,
      entityType: MonkEntityType.IMAGE,
      entity: { id, url: 'url-2' } as Image,
    };
    const result = monkReducer(state, action);

    const expected = createEmptyMonkState();
    expected.images.push({ id, url: 'url-2' } as Image);
    expect(result).toEqual(expected);
  });

  it('should create and / or update entities after a GOT_MANY dispatch', () => {
    const state = createEmptyMonkState();
    state.vehicles.push(
      { id: 'test-id-1', type: 'type-1' } as Vehicle,
      { id: 'test-id-2' } as Vehicle,
    );
    const action: MonkGotManyAction<Vehicle> = {
      type: MonkActionType.GOT_MANY_ENTITIES,
      entityType: MonkEntityType.VEHICLE,
      entities: [{ id: 'test-id-2', type: 'type-2' }, { id: 'test-id-3' }] as Vehicle[],
    };
    const result = monkReducer(state, action);

    const expected = createEmptyMonkState();
    expected.vehicles.push(
      { id: 'test-id-1', type: 'type-1' } as Vehicle,
      { id: 'test-id-2', type: 'type-2' } as Vehicle,
      { id: 'test-id-3' } as Vehicle,
    );
    expect(result).toEqual(expected);
  });

  it('should delete an entity after a DELETED_ONE dispatch', () => {
    const id = 'test-id-1';
    const state = createEmptyMonkState();
    state.tasks.push({ id } as Task);
    const action: MonkDeletedOneAction = {
      type: MonkActionType.DELETED_ONE_ENTITY,
      entityType: MonkEntityType.TASK,
      id,
    };
    const result = monkReducer(state, action);

    expect(result).toEqual(createEmptyMonkState());
  });

  it('should not delete an entity if it does not exist after a DELETED_ONE dispatch', () => {
    const id = 'test-id-1';
    const state = createEmptyMonkState();
    state.wheelAnalysis.push({ id } as WheelAnalysis);
    const action: MonkDeletedOneAction = {
      type: MonkActionType.DELETED_ONE_ENTITY,
      entityType: MonkEntityType.TASK,
      id,
    };
    const result = monkReducer(state, action);

    expect(result).toEqual(state);
  });

  it('should delete multiple entities after a DELETED_MANY dispatch', () => {
    const state = createEmptyMonkState();
    state.severityResults.push(
      { id: 'test-id-1' } as SeverityResult,
      { id: 'test-id-2' } as SeverityResult,
      { id: 'test-id-3' } as SeverityResult,
    );
    state.partOperations.push({ id: 'test-id-4' } as PartOperation);
    const action: MonkDeletedManyAction = {
      type: MonkActionType.DELETED_MANY_ENTITIES,
      entityType: MonkEntityType.SEVERITY_RESULT,
      ids: ['test-id-1', 'test-id-3', 'test-id-4'],
    };
    const result = monkReducer(state, action);

    const expected = createEmptyMonkState();
    expected.severityResults.push({ id: 'test-id-2' } as SeverityResult);
    expected.partOperations.push({ id: 'test-id-4' } as PartOperation);
    expect(result).toEqual(expected);
  });
});
