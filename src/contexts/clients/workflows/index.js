import Clients from '../clients';
import Workflows from './workflows';

const ClientWorkflows = {
  [Clients.DEFAULT]: Workflows.DEFAULT,
  [Clients.CAT]: Workflows.CAPTURE_VEHICLE_SELECTION,
  [Clients.FASTBACK]: Workflows.DEFAULT,
  [Clients.ALPHA]: Workflows.DEFAULT,
  [Clients.ALGODRIVEN_CAPTURE]: Workflows.CAPTURE,
  [Clients.ALGODRIVEN_REPORT]: Workflows.INSPECTION_REPORT,
  [Clients.VIDEO_POC]: Workflows.INSPECTION_REPORT,
};

export default ClientWorkflows;

export { default as Workflows } from './workflows';
