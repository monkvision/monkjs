/**
 * Enumeration of possible values for the ownership filter fields in the back-end API. Allows the user to specify
 * which values he wants to fetch when fetching many entities at once.
 *
 * *Swagger Schema Reference :* `OwnershipFilterValue`
 */
export enum OwnershipFilter {
  /**
   * Only fetch the user's own resources.
   */
  OWN_RESOURCES = 'own_resources',
  /**
   * Fetch all resources belonging to the user's organization.
   */
  ORGANIZATION_RESOURCES = 'organization_resources',
  /**
   * Fetch *all* resources that match the query.
   */
  ALL_RESOURCES = 'all_resources',
}
