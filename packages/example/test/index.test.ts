import { myExample } from '../src';

describe('Hello World test', () => {
  it('should return the message', () => {
    expect(myExample.helloWorld()).toEqual('Hello world !');
  });
});
