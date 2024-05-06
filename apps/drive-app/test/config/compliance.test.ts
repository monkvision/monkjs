import { ComplianceIssue } from '@monkvision/types';
import { complianceIssuesPerSight } from '../../src/config';

const IQA = [
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
];

describe('Drive compliance config', () => {
  it('should only enable IQA for interior sights', () => {
    expect(complianceIssuesPerSight).toEqual({
      'all-IqwSM3': IQA,
      'all-rSvk2C': IQA,
      'all-T4HrF8KA': IQA,
    });
  });
});
