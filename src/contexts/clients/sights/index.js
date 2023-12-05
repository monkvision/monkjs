import Clients from '../clients';
import defaultSights from './default';
import defaultWithVin from './defaultWithVin';

const ClientSights = {
  [Clients.DEFAULT]: defaultSights,
  [Clients.CAT]: defaultWithVin,
  [Clients.FASTBACK]: defaultSights,
  [Clients.ALPHA]: defaultSights,
  [Clients.ALGODRIVEN_CAPTURE]: defaultSights,
  [Clients.ALGODRIVEN_REPORT]: defaultSights,
  [Clients.VIDEO_POC]: defaultSights,
};

export default ClientSights;
