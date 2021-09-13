import axios from 'axios';
import { getInspectionAsync } from 'Inspection';

export default class Root {
  /**
   * @param baseURL
   * @param bearerToken
   * @param clientId {string}
   * @param additionalHeaders {{any: string}}
   * @constructor
   */
  constructor(baseURL, bearerToken, clientId, additionalHeaders = {}) {
    this._clientId = clientId;
    this._bearerToken = bearerToken;
    this._serverInstance = axios.create({
      baseURL,
      timeout: 60000, // 1 minute!
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        ...additionalHeaders,
      },
    });

    this.getInspectionAsync = getInspectionAsync.bind(this);
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
  }

  get bearerToken() {
    return this._bearerToken;
  }

  set bearerToken(value) {
    this._bearerToken = value;
  }

  get serverInstance() {
    return this._serverInstance;
  }

  set serverInstance(value) {
    this._serverInstance = value;
  }
}

export function createRoot() {
  return new Root(process.env.MONK_DOMAIN, process.env.BEARER_TOKEN);
}
