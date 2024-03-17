export = {
  /* Actual exports */
  /* Mocks */
  Navigate: jest.fn(() => <></>),
  useSearchParams: jest.fn(() => [{ get: jest.fn() }]),
  useNavigate: jest.fn(() => jest.fn()),
};
