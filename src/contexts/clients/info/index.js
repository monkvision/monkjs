import Clients from '../clients';
import defaultInfo from './default';
import catInfo from './cat';
import fastbackInfo from './fastback';

const ClientInfo = {
  [Clients.DEFAULT]: defaultInfo,
  [Clients.CAT]: catInfo,
  [Clients.FASTBACK]: fastbackInfo,
};

export default ClientInfo;
