import axios from 'axios';

export default class MonkSDK {
  /**
   * @param clientId {string}
   * @param serverInstance
   * @constructor
   */
  constructor(clientId, serverInstance = axios.create({
    baseURL: 'https://eu.monk.ai',
    timeout: 1000,
  })) {
    this.serverInstance = serverInstance;
    this.clientId = clientId;
  }

  init() {
    return this;
  }
}
