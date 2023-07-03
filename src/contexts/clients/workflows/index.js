import Clients from '../clients';
import Workflows from './workflows';

const ClientWorkflows = {
  [Clients.DEFAULT]: Workflows.DEFAULT,
  [Clients.CAT]: Workflows.CAPTURE,
  [Clients.FASTBACK]: Workflows.DEFAULT,
  [Clients.ALPHA]: Workflows.DEFAULT,
};

export default ClientWorkflows;

export { default as Workflows } from './workflows';
