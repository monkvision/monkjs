import { PaginationDetails, PaginationOrder } from '../../src/sharedTypes';

export function createMockPaging(): PaginationDetails {
  return {
    next: 'next',
    previous: 'previous',
    cursors: {
      next: { limit: 20, paginationOrder: PaginationOrder.ASC, after: 'after2' },
      previous: { limit: 20, paginationOrder: PaginationOrder.ASC, after: 'after3' },
      after: 'after4',
      before: 'before5',
    },
  };
}
