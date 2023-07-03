import Clients from '../clients';
import defaultInfo from './default';
import catInfo from './cat';
import fastbackInfo from './fastback';
import alphaInfo from './alpha';

const ClientInfo = {
  [Clients.DEFAULT]: defaultInfo,
  [Clients.CAT]: catInfo,
  [Clients.FASTBACK]: fastbackInfo,
  [Clients.ALPHA]: alphaInfo,
};

export default ClientInfo;
