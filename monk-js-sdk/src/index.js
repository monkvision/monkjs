import axios from 'axios';

export default class MonkSDK {
  /**
   * @param clientId {string}
   * @param token {string}
   * @param serverInstance
   * @constructor
   */
  constructor(clientId, token, serverInstance = axios.create({
    baseURL: 'https://eu.monk.ai',
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })) {
    this._clientId = clientId;
    this._token = token;
    this._serverInstance = serverInstance;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get token() {
    return this._token;
  }

  set token(value) {
    this._token = value;
  }

  get serverInstance() {
    return this._serverInstance;
  }

  set serverInstance(value) {
    this._serverInstance = value;
  }

  init() {
    return this;
  }
}
