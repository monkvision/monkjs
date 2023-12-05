import Clients from '../clients';
import defaultInfo from './default';
import catInfo from './cat';
import fastbackInfo from './fastback';
import alphaInfo from './alpha';
import algodrivenInfo from './algodriven';
import videoPocInfo from './videoPoc';

const ClientInfo = {
  [Clients.DEFAULT]: defaultInfo,
  [Clients.CAT]: catInfo,
  [Clients.FASTBACK]: fastbackInfo,
  [Clients.ALPHA]: alphaInfo,
  [Clients.ALGODRIVEN_CAPTURE]: algodrivenInfo,
  [Clients.ALGODRIVEN_REPORT]: algodrivenInfo,
  [Clients.VIDEO_POC]: videoPocInfo,
};

export default ClientInfo;
