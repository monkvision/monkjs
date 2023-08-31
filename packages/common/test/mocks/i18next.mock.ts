export interface CreateMockI18nInstanceParams {
  changeLanguage?: (lng: string) => Promise<void>;
}

export interface I18nMockInstance {
  language: string;
  changeLanguage: jest.Mock;
  on: (event: string, callback: (...args: any) => void) => void;
  use: jest.Mock;
  init: jest.Mock;
  fire: (event: string, ...args: any) => void;
}

export function createMockI18nInstance(params?: CreateMockI18nInstanceParams): I18nMockInstance {
  const eventMap = new Map<string, ((...args: any) => void)[]>();
  const instance: I18nMockInstance = {
    language: 'fr',
    changeLanguage: jest.fn(params?.changeLanguage ?? (() => Promise.resolve(undefined))),
    on: (event: string, callback: (...args: any) => void) => {
      const handlers = eventMap.get(event) ?? [];
      eventMap.set(event, [...handlers, callback]);
    },
    use: jest.fn(() => instance),
    init: jest.fn(() => Promise.resolve(undefined)),
    fire: (event: string, ...args: any) => {
      const handlers = eventMap.get(event) ?? [];
      handlers.forEach((handler) => handler(...args));
    },
  };
  return instance;
}
