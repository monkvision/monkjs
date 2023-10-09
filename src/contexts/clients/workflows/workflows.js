const Workflows = {
  /**
   * Default workflow :
   * - Normal landing screen
   */
  DEFAULT: 'default',
  /**
   * Capture only workflow :
   * - No landing screen
   * - Vehicle type in params / If no vehicle type : CUV by default
   */
  CAPTURE: 'capture',
  /**
   * Capture + optional vehicle selection only workflow :
   * - No landing screen
   * - Vehicle type in params /If no vehicle type : redirected to vehicle type selection page
   */
  CAPTURE_VEHICLE_SELECTION: 'capture vehicle selection',
};

export default Workflows;
