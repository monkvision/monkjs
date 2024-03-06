import { build } from '../../src/build';
import * as buildJSONsModule from '../../src/build/buildJSONs';

describe('Build function', () => {
  it('should call the compileJSONs function', () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const spy = jest.spyOn(buildJSONsModule, 'buildJSONs').mockImplementation(() => {});

    build();

    expect(spy).toHaveBeenCalled();
    jest.spyOn(console, 'log').mockRestore();
  });
});
