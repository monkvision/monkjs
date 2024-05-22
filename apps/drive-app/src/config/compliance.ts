import {
  ComplianceIssue,
  DEFAULT_COMPLIANCE_ISSUES,
  IQA_COMPLIANCE_ISSUES,
} from '@monkvision/types';

export const complianceIssuesPerSight: Record<string, ComplianceIssue[]> = {
  'all-IqwSM3': IQA_COMPLIANCE_ISSUES,
  'all-rSvk2C': IQA_COMPLIANCE_ISSUES,
  'all-T4HrF8KA': IQA_COMPLIANCE_ISSUES,
};

export const complianceIssues: ComplianceIssue[] = DEFAULT_COMPLIANCE_ISSUES;
