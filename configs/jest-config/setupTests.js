const fs = require('fs');
const path = require('path');

const mocks = fs.readdirSync(
  path.join(__dirname, '..', 'test-utils', 'src', '__mocks__'),
  { recursive: true },
).filter((name) => !name.startsWith('imports') && !name.match(/^@[^/]+$/g))
  .map((name) => name.substring(0, name.length - (name.endsWith('x') ? 4 : 3)));

mocks.forEach((mock) => {
  jest.mock(mock, () => require('@monkvision/test-utils/src/__mocks__/' + mock));
});
