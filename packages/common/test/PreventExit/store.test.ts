import { createPreventExitListener } from '../../src/PreventExit/store';

describe('preventExitStore', () => {
  let listener1: ReturnType<typeof createPreventExitListener>;
  let listener2: ReturnType<typeof createPreventExitListener>;

  beforeEach(() => {
    listener1 = createPreventExitListener();
    listener2 = createPreventExitListener();
  });

  afterEach(() => {
    listener1.cleanup();
    listener2.cleanup();
  });

  it('should prevent exit: listener 1', () => {
    listener1.setPreventExit(true);
    listener2.setPreventExit(true);
    expect(window.onbeforeunload).not.toBe(null);
    listener1.setPreventExit(true);
    listener2.setPreventExit(false);
    expect(window.onbeforeunload).not.toBe(null);
    listener1.setPreventExit(false);
    listener2.setPreventExit(true);
    expect(window.onbeforeunload).not.toBe(null);
    listener1.setPreventExit(false);
    listener2.setPreventExit(false);
    expect(window.onbeforeunload).toBe(null);
  });

  it('should allow redirect: listener 1', () => {
    const preventExit = [true, false];
    preventExit.forEach((i) => {
      preventExit.forEach((j) => {
        listener1.setPreventExit(i);
        listener2.setPreventExit(j);
        listener1.allowRedirect();
        expect(window.onbeforeunload).toBe(null);
      });
    });
  });

  it('should allow redirect: lister 2', () => {
    listener2.cleanup();
    listener1.cleanup();
    expect(window.onbeforeunload).toBe(null);
  });
});
