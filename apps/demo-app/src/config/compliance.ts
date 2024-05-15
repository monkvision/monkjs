import { ComplianceIssue, DEFAULT_COMPLIANCE_ISSUES } from '@monkvision/types';

export const complianceIssues: ComplianceIssue[] = DEFAULT_COMPLIANCE_ISSUES.filter(
  (issue) => ![ComplianceIssue.WRONG_ANGLE, ComplianceIssue.WRONG_CENTER_PART].includes(issue),
);
