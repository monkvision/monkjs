import Clients from '../clients';
import defaultConfig from './default';
import catConfig from './cat';
import fastbackConfig from './fastback';
import alphaConfig from './alpha';

const ClientMonitoring = {
  [Clients.DEFAULT]: defaultConfig,
  [Clients.CAT]: catConfig,
  [Clients.FASTBACK]: fastbackConfig,
  [Clients.ALPHA]: alphaConfig,
};

export default ClientMonitoring;
