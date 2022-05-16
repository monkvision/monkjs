/**
 * Parameters used to paginate a list of entities fetched from the back-end.
 */
export interface PaginationParams {
  /**
   * The maximum number of entities to fetch.
   * @default 100
   */
  limit?: number;
  /**
   * The uuid of the first entity *after* the list to be fetched.
   */
  before?: string;
  /**
   * The uuid of the last entity *before* the list to be fetched.
   */
  after?: string;
  /**
   * The order of the paginaztion relative to the sorting method.
   * @default PaginationOrder.DESC
   */
  paginationOrder?: PaginationOrder;
}

/**
 * Enumeration of possible pagination orders used when fetching a list of entities from the back-end.
 */
export enum PaginationOrder {
  /**
   * Ascending order, from lowest to highest.
   */
  ASC = 'asc',
  /**
   * Descending order, from highest to lowest.
   */
  DESC = 'desc',
}

/**
 * The format of the API response when fetching a page of entities.
 *
 * *Swagger Schema Reference :* `PaginatedResponse`
 */
export interface PaginatedResponse<Entity> {
  /**
   * The page of entities that has been fetched.
   */
  data: Entity[],
  /**
   * The information used to navigate to the next or previous page.
   */
  paging?: PaginationDetails,
}

/**
 * The pagination information added to a pagination request by the API.
 *
 * *Swagger Schema Reference :* `Pagination`
 */
export interface PaginationDetails {
  /**
   * The cursor information used to navigate to the next or previous page.
   */
  cursors: Cursors;
  /**
   * The uuid of the next entity after the list, if there is one.
   */
  next?: string;
  /**
   * The uuid of the first entity before the list, if there is one.
   */
  previous?: string;
}

/**
 * The cursor information used to navigate between pages.
 *
 * *Swagger Schema Reference :* `Cursors`
 */
export interface Cursors {
  /**
   * The uuid of the first element fetched by the request.
   */
  before?: string;
  /**
   * The uuid of the last element fetched by the request.
   */
  after?: string;
  /**
   * The pagination parameters needed to get the next page, if there is one.
   */
  next?: PaginationParams;
  /**
   * The pagination parameters needed to get the previous page, if there is one.
   */
  previous?: PaginationParams;
}
