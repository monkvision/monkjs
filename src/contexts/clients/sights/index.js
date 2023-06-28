import Clients from '../clients';
import defaultSights from './default';
import catSights from './cat';

const ClientSights = {
  [Clients.DEFAULT]: defaultSights,
  [Clients.CAT]: catSights,
  [Clients.FASTBACK]: defaultSights,
  [Clients.ALPHA]: defaultSights,
};

export default ClientSights;
