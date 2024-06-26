const keys: Array<symbol> = [];
const allPreventExitState: Record<symbol, boolean> = {};

function checkNoMorePreventExit() {
  if (keys.map((key) => allPreventExitState[key]).every((i) => i === false)) {
    window.onbeforeunload = null;
    return true;
  }
  return false;
}
function publish(id: symbol, preventExit: boolean) {
  allPreventExitState[id] = preventExit;
  if (!checkNoMorePreventExit())
    window.onbeforeunload = (e) => {
      e.preventDefault();
      return 'Confirm Alert appears';
    };
}
/**
 * Creates a listener function that manages the preventExit state of a component.
 */
export function createPreventExitListener() {
  const key = Symbol('PreventExitListener');
  allPreventExitState[key] = true;
  keys.push(key);
  return {
    /**
     * To change the preventExit state of the component.
     */
    setPreventExit: (preventExit: boolean) => {
      publish(key, preventExit);
    },
    /**
     * Allows the user to leave the page without confirmation temporarily.
     * This should be used when the developer wants to explicitly allow navigation.
     */
    allowRedirect: () => {
      window.onbeforeunload = null;
    },
    /**
     * Performs garbage collection by removing the preventExit state associated with the component.
     * This should be used when the component is unmounted.
     */
    cleanup: () => {
      delete allPreventExitState[key];
      checkNoMorePreventExit();
    },
  };
}
