import Clients from '../clients';
import defaultConfig from './default';
import catConfig from './cat';
import fastbackConfig from './fastback';
import alphaConfig from './alpha';
import algoDrivenConfig from './algodriven';

const ClientMonitoring = {
  [Clients.DEFAULT]: defaultConfig,
  [Clients.CAT]: catConfig,
  [Clients.FASTBACK]: fastbackConfig,
  [Clients.ALPHA]: alphaConfig,
  [Clients.ALGODRIVEN_CAPTURE]: algoDrivenConfig,
  [Clients.ALGODRIVEN_REPORT]: algoDrivenConfig,
};

export default ClientMonitoring;
