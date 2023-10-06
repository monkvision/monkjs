import Clients from '../clients';
import defaultSights from './default';
import defaultWithVin from './defaultWithVin';

const ClientSights = {
  [Clients.DEFAULT]: defaultSights,
  [Clients.CAT]: defaultWithVin,
  [Clients.FASTBACK]: defaultSights,
  [Clients.ALPHA]: defaultSights,
  [Clients.ALGODRIVEN]: defaultSights,
};

export default ClientSights;
