import {
  createEmptyMonkState,
  gotOneInspection,
  isGotOneInspectionAction,
  MonkActionType,
  MonkGotOneInspectionAction,
  MonkState,
} from '../../../src';
import {
  Damage,
  DamageType,
  Image,
  Inspection,
  Part,
  PartOperation,
  PricingV2,
  PricingV2RelatedItemType,
  RenderedOutput,
  SeverityResult,
  Task,
  Vehicle,
  VehiclePart,
  View,
} from '@monkvision/types';

const action: MonkGotOneInspectionAction = {
  type: MonkActionType.GOT_ONE_INSPECTION,
  payload: {
    damages: [{ id: 'damages-test' } as Damage],
    images: [{ id: 'images-test' } as Image],
    inspections: [{ id: 'inspections-test' } as Inspection],
    parts: [{ id: 'parts-test' } as Part],
    partOperations: [{ id: 'partOperations-test' } as PartOperation],
    renderedOutputs: [{ id: 'renderedOutputs-test' } as RenderedOutput],
    severityResults: [{ id: 'severityResults-test' } as SeverityResult],
    tasks: [{ id: 'tasks-test' } as Task],
    vehicles: [{ id: 'vehicles-test' } as Vehicle],
    views: [{ id: 'views-test' } as View],
    pricings: [{ id: 'pricings-test' } as PricingV2],
  },
};

describe('GotOneInspection action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isGotOneInspectionAction({ type: MonkActionType.GOT_ONE_INSPECTION })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isGotOneInspectionAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(gotOneInspection(state, action), state)).toBe(false);
    });

    it('should add new entities to the state', () => {
      const state = {
        damages: [{ id: 'damages-test-111111' } as Damage],
        images: [{ id: 'images-test-111111' } as Image],
        inspections: [{ id: 'inspections-test-111111' } as Inspection],
        parts: [{ id: 'parts-test-111111' } as Part],
        partOperations: [{ id: 'partOperations-test-111111' } as PartOperation],
        renderedOutputs: [{ id: 'renderedOutputs-test-111111' } as RenderedOutput],
        severityResults: [{ id: 'severityResults-test-111111' } as SeverityResult],
        tasks: [{ id: 'tasks-test-111111' } as Task],
        vehicles: [{ id: 'vehicles-test-111111' } as Vehicle],
        views: [{ id: 'views-test-111111' } as View],
        pricings: [{ id: 'pricings-test-111111' } as PricingV2],
      };
      const newState = gotOneInspection(state, action);
      Object.keys(createEmptyMonkState()).forEach((key) => {
        const entityKey = key as keyof MonkState;
        expect(newState[entityKey].length).toEqual(2);
        expect(newState[entityKey]).toContainEqual((action.payload as MonkState)[entityKey][0]);
      });
    });

    it('should update existing entities in the state', () => {
      const state = {
        damages: [{ id: 'damages-test', type: DamageType.BODY_CRACK } as Damage],
        images: [{ id: 'images-test', siblingKey: 'siblingKey' } as Image],
        inspections: [{ id: 'inspections-test', images: ['test'] } as Inspection],
        parts: [{ id: 'parts-test', type: VehiclePart.WHEEL } as Part],
        partOperations: [{ id: 'partOperations-test', name: 'te' } as PartOperation],
        renderedOutputs: [{ id: 'renderedOutputs-test', path: 'ew' } as RenderedOutput],
        severityResults: [{ id: 'severityResults-test', inspectionId: 'tes' } as SeverityResult],
        tasks: [{ id: 'tasks-test', images: ['ok'] } as Task],
        vehicles: [{ id: 'vehicles-test', type: 'nice' } as Vehicle],
        views: [{ id: 'views-test', elementId: 'ww' } as View],
        pricings: [
          {
            id: 'pricings-test',
            relatedItemType: PricingV2RelatedItemType.PART,
          } as PricingV2,
        ],
      };
      const newState = gotOneInspection(state, action);
      Object.keys(createEmptyMonkState()).forEach((key) => {
        const entityKey = key as keyof MonkState;
        expect(newState[entityKey].length).toEqual(1);
        expect(newState[entityKey][0]).toEqual((action.payload as MonkState)[entityKey][0]);
      });
    });
  });
});
