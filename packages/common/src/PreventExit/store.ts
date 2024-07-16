const keys: Array<symbol> = [];
const allPreventExitState: Record<symbol, boolean> = {};

function arePreventExitRemaining() {
  if (keys.map((key) => allPreventExitState[key]).every((i) => i === false)) {
    window.onbeforeunload = null;
    return true;
  }

  return false;
}

function publish(id: symbol, preventExit: boolean) {
  allPreventExitState[id] = preventExit;
  if (!arePreventExitRemaining())
    window.onbeforeunload = (e) => {
      e.preventDefault();
      return 'prevent-exit';
    };
}

/**
 * Returns a listener which can used to calculate the state of prevent exit
 */
export interface PreventExitListenerResult {
  /**
   * Callback used to set the value indicating if direct exit of the page is currently allowed or not.
   */
  setPreventExit: (preventExit: boolean) => void;
  /**
   * Allows the user to leave the page without confirmation temporarily.
   * This should be used when the developer wants to explicitly allow navigation.
   */
  allowRedirect: () => void;
  /**
   * Performs garbage collection by removing the preventExit state associated with the component.
   * This should be used when the component is unmounted.
   */
  cleanup: () => void;
}

/**
 * Creates a listener function that manages the preventExit state of a component.
 */
export function createPreventExitListener(): PreventExitListenerResult {
  const key = Symbol('PreventExitListener');
  allPreventExitState[key] = true;
  keys.push(key);

  return {
    setPreventExit: (preventExit) => publish(key, preventExit),
    allowRedirect: () => {
      window.onbeforeunload = null;
    },
    cleanup: () => {
      delete allPreventExitState[key];
      arePreventExitRemaining();
    },
  };
}
