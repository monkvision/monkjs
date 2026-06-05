import { VehiclePart } from '@monkvision/types';
import {
  getChildPartsForAggregation,
  isChildPartForAggregation,
  getParentPartForChild,
  isParentPartForAggregation,
  WHEEL_PART_AGGREGATIONS,
  PART_AGGREGATIONS,
} from '../../src/utils/partAggregation.utils';

const PARENT_PART_WHEEL_FRONT_LEFT = VehiclePart.WHEEL_FRONT_LEFT;
const CHILD_PART_RIM_FRONT_LEFT = VehiclePart.RIM_FRONT_LEFT;
const CHILD_PART_HUBCAP_FRONT_LEFT = VehiclePart.HUBCAP_FRONT_LEFT;

const PARENT_PART_WHEEL_FRONT_RIGHT = VehiclePart.WHEEL_FRONT_RIGHT;
const CHILD_PART_RIM_FRONT_RIGHT = VehiclePart.RIM_FRONT_RIGHT;
const CHILD_PART_HUBCAP_FRONT_RIGHT = VehiclePart.HUBCAP_FRONT_RIGHT;

const PARENT_PART_WHEEL_BACK_LEFT = VehiclePart.WHEEL_BACK_LEFT;
const CHILD_PART_RIM_BACK_LEFT = VehiclePart.RIM_BACK_LEFT;
const CHILD_PART_HUBCAP_BACK_LEFT = VehiclePart.HUBCAP_BACK_LEFT;

const PARENT_PART_WHEEL_BACK_RIGHT = VehiclePart.WHEEL_BACK_RIGHT;
const CHILD_PART_RIM_BACK_RIGHT = VehiclePart.RIM_BACK_RIGHT;
const CHILD_PART_HUBCAP_BACK_RIGHT = VehiclePart.HUBCAP_BACK_RIGHT;

const NON_AGGREGATED_PART = VehiclePart.HOOD;

describe('partAggregation.utils', () => {
  describe('constants', () => {
    it('should define WHEEL_PART_AGGREGATIONS with correct structure', () => {
      expect(WHEEL_PART_AGGREGATIONS).toBeDefined();
      expect(Array.isArray(WHEEL_PART_AGGREGATIONS)).toBe(true);
      expect(WHEEL_PART_AGGREGATIONS.length).toBe(4);
    });

    it('should include all four wheel configurations', () => {
      const parents = WHEEL_PART_AGGREGATIONS.map((config) => config.parent);

      expect(parents).toContain(PARENT_PART_WHEEL_FRONT_LEFT);
      expect(parents).toContain(PARENT_PART_WHEEL_FRONT_RIGHT);
      expect(parents).toContain(PARENT_PART_WHEEL_BACK_LEFT);
      expect(parents).toContain(PARENT_PART_WHEEL_BACK_RIGHT);
    });

    it('should map each wheel to its rim and hubcap', () => {
      const frontLeftConfig = WHEEL_PART_AGGREGATIONS.find(
        (c) => c.parent === PARENT_PART_WHEEL_FRONT_LEFT,
      );

      expect(frontLeftConfig?.children).toContain(CHILD_PART_RIM_FRONT_LEFT);
      expect(frontLeftConfig?.children).toContain(CHILD_PART_HUBCAP_FRONT_LEFT);
      expect(frontLeftConfig?.children.length).toBe(2);
    });

    it('should have PART_AGGREGATIONS equal to WHEEL_PART_AGGREGATIONS', () => {
      expect(PART_AGGREGATIONS).toEqual(WHEEL_PART_AGGREGATIONS);
    });
  });

  describe('getChildPartsForAggregation', () => {
    it('should return child parts for a parent part', () => {
      const children = getChildPartsForAggregation(PARENT_PART_WHEEL_FRONT_LEFT);

      expect(children).toContain(CHILD_PART_RIM_FRONT_LEFT);
      expect(children).toContain(CHILD_PART_HUBCAP_FRONT_LEFT);
      expect(children.length).toBe(2);
    });

    it('should return correct children for all wheel positions', () => {
      const frontRightChildren = getChildPartsForAggregation(PARENT_PART_WHEEL_FRONT_RIGHT);
      const backLeftChildren = getChildPartsForAggregation(PARENT_PART_WHEEL_BACK_LEFT);
      const backRightChildren = getChildPartsForAggregation(PARENT_PART_WHEEL_BACK_RIGHT);

      expect(frontRightChildren).toContain(CHILD_PART_RIM_FRONT_RIGHT);
      expect(frontRightChildren).toContain(CHILD_PART_HUBCAP_FRONT_RIGHT);

      expect(backLeftChildren).toContain(CHILD_PART_RIM_BACK_LEFT);
      expect(backLeftChildren).toContain(CHILD_PART_HUBCAP_BACK_LEFT);

      expect(backRightChildren).toContain(CHILD_PART_RIM_BACK_RIGHT);
      expect(backRightChildren).toContain(CHILD_PART_HUBCAP_BACK_RIGHT);
    });

    it('should return empty array for non-parent parts', () => {
      const children = getChildPartsForAggregation(NON_AGGREGATED_PART);

      expect(children).toEqual([]);
    });

    it('should return empty array for child parts', () => {
      const children = getChildPartsForAggregation(CHILD_PART_RIM_FRONT_LEFT);

      expect(children).toEqual([]);
    });
  });

  describe('isChildPartForAggregation', () => {
    it('should return true for rim parts', () => {
      expect(isChildPartForAggregation(CHILD_PART_RIM_FRONT_LEFT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_RIM_FRONT_RIGHT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_RIM_BACK_LEFT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_RIM_BACK_RIGHT)).toBe(true);
    });

    it('should return true for hubcap parts', () => {
      expect(isChildPartForAggregation(CHILD_PART_HUBCAP_FRONT_LEFT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_HUBCAP_FRONT_RIGHT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_HUBCAP_BACK_LEFT)).toBe(true);
      expect(isChildPartForAggregation(CHILD_PART_HUBCAP_BACK_RIGHT)).toBe(true);
    });

    it('should return false for parent parts', () => {
      expect(isChildPartForAggregation(PARENT_PART_WHEEL_FRONT_LEFT)).toBe(false);
      expect(isChildPartForAggregation(PARENT_PART_WHEEL_FRONT_RIGHT)).toBe(false);
      expect(isChildPartForAggregation(PARENT_PART_WHEEL_BACK_LEFT)).toBe(false);
      expect(isChildPartForAggregation(PARENT_PART_WHEEL_BACK_RIGHT)).toBe(false);
    });

    it('should return false for non-aggregated parts', () => {
      expect(isChildPartForAggregation(NON_AGGREGATED_PART)).toBe(false);
      expect(isChildPartForAggregation(VehiclePart.BUMPER_FRONT)).toBe(false);
      expect(isChildPartForAggregation(VehiclePart.BUMPER_BACK)).toBe(false);
    });
  });

  describe('getParentPartForChild', () => {
    it('should return correct parent for rim parts', () => {
      expect(getParentPartForChild(CHILD_PART_RIM_FRONT_LEFT)).toBe(PARENT_PART_WHEEL_FRONT_LEFT);
      expect(getParentPartForChild(CHILD_PART_RIM_FRONT_RIGHT)).toBe(PARENT_PART_WHEEL_FRONT_RIGHT);
      expect(getParentPartForChild(CHILD_PART_RIM_BACK_LEFT)).toBe(PARENT_PART_WHEEL_BACK_LEFT);
      expect(getParentPartForChild(CHILD_PART_RIM_BACK_RIGHT)).toBe(PARENT_PART_WHEEL_BACK_RIGHT);
    });

    it('should return correct parent for hubcap parts', () => {
      expect(getParentPartForChild(CHILD_PART_HUBCAP_FRONT_LEFT)).toBe(
        PARENT_PART_WHEEL_FRONT_LEFT,
      );
      expect(getParentPartForChild(CHILD_PART_HUBCAP_FRONT_RIGHT)).toBe(
        PARENT_PART_WHEEL_FRONT_RIGHT,
      );
      expect(getParentPartForChild(CHILD_PART_HUBCAP_BACK_LEFT)).toBe(PARENT_PART_WHEEL_BACK_LEFT);
      expect(getParentPartForChild(CHILD_PART_HUBCAP_BACK_RIGHT)).toBe(
        PARENT_PART_WHEEL_BACK_RIGHT,
      );
    });

    it('should return null for parent parts', () => {
      expect(getParentPartForChild(PARENT_PART_WHEEL_FRONT_LEFT)).toBeNull();
      expect(getParentPartForChild(PARENT_PART_WHEEL_FRONT_RIGHT)).toBeNull();
      expect(getParentPartForChild(PARENT_PART_WHEEL_BACK_LEFT)).toBeNull();
      expect(getParentPartForChild(PARENT_PART_WHEEL_BACK_RIGHT)).toBeNull();
    });

    it('should return null for non-aggregated parts', () => {
      expect(getParentPartForChild(NON_AGGREGATED_PART)).toBeNull();
      expect(getParentPartForChild(VehiclePart.BUMPER_FRONT)).toBeNull();
      expect(getParentPartForChild(VehiclePart.BUMPER_BACK)).toBeNull();
    });
  });

  describe('isParentPartForAggregation', () => {
    it('should return true for all wheel parts', () => {
      expect(isParentPartForAggregation(PARENT_PART_WHEEL_FRONT_LEFT)).toBe(true);
      expect(isParentPartForAggregation(PARENT_PART_WHEEL_FRONT_RIGHT)).toBe(true);
      expect(isParentPartForAggregation(PARENT_PART_WHEEL_BACK_LEFT)).toBe(true);
      expect(isParentPartForAggregation(PARENT_PART_WHEEL_BACK_RIGHT)).toBe(true);
    });

    it('should return false for rim parts', () => {
      expect(isParentPartForAggregation(CHILD_PART_RIM_FRONT_LEFT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_RIM_FRONT_RIGHT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_RIM_BACK_LEFT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_RIM_BACK_RIGHT)).toBe(false);
    });

    it('should return false for hubcap parts', () => {
      expect(isParentPartForAggregation(CHILD_PART_HUBCAP_FRONT_LEFT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_HUBCAP_FRONT_RIGHT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_HUBCAP_BACK_LEFT)).toBe(false);
      expect(isParentPartForAggregation(CHILD_PART_HUBCAP_BACK_RIGHT)).toBe(false);
    });

    it('should return false for non-aggregated parts', () => {
      expect(isParentPartForAggregation(NON_AGGREGATED_PART)).toBe(false);
      expect(isParentPartForAggregation(VehiclePart.BUMPER_FRONT)).toBe(false);
      expect(isParentPartForAggregation(VehiclePart.BUMPER_BACK)).toBe(false);
    });
  });

  describe('consistency checks', () => {
    it('should have symmetric relationship between parent and child functions', () => {
      const allChildren = PART_AGGREGATIONS.flatMap((config) => config.children);

      allChildren.forEach((child) => {
        expect(isChildPartForAggregation(child)).toBe(true);
        const parent = getParentPartForChild(child);
        expect(parent).not.toBeNull();

        if (parent) {
          const childrenOfParent = getChildPartsForAggregation(parent);
          expect(childrenOfParent).toContain(child);
        }
      });
    });

    it('should ensure parents do not appear as children', () => {
      const allParents = PART_AGGREGATIONS.map((config) => config.parent);
      const allChildren = PART_AGGREGATIONS.flatMap((config) => config.children);

      allParents.forEach((parent) => {
        expect(allChildren).not.toContain(parent);
      });
    });

    it('should ensure no child appears in multiple aggregations', () => {
      const allChildren = PART_AGGREGATIONS.flatMap((config) => config.children);
      const uniqueChildren = new Set(allChildren);

      expect(allChildren.length).toBe(uniqueChildren.size);
    });

    it('should validate parent-child queries are consistent', () => {
      PART_AGGREGATIONS.forEach((config) => {
        expect(isParentPartForAggregation(config.parent)).toBe(true);

        const retrievedChildren = getChildPartsForAggregation(config.parent);
        expect(retrievedChildren).toEqual(config.children);

        config.children.forEach((child) => {
          expect(isChildPartForAggregation(child)).toBe(true);
          expect(getParentPartForChild(child)).toBe(config.parent);
        });
      });
    });
  });
});
