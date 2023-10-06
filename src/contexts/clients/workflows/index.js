import Clients from '../clients';
import Workflows from './workflows';

const ClientWorkflows = {
  [Clients.DEFAULT]: Workflows.DEFAULT,
  [Clients.CAT]: Workflows.CAPTURE_VEHICLE_SELECTION,
  [Clients.FASTBACK]: Workflows.DEFAULT,
  [Clients.ALPHA]: Workflows.DEFAULT,
  [Clients.ALGODRIVEN]: Workflows.CAPTURE,
};

export default ClientWorkflows;

export { default as Workflows } from './workflows';
