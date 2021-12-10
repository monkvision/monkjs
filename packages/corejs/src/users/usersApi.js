import axios from 'axios';
import config from '../config';

export function getOne({ id, accessToken, ...customReqConfig }) {
  const http = axios.create({
    baseURL: `https://${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/`,
    headers: { 'Access-Control-Allow-Origin': '*', Authorization: accessToken },
  });

  return http.request({
    method: 'get',
    url: `/users/${id}`,
    ...customReqConfig,
  });
}

export function updateOne({ id, accessToken, data, ...customReqConfig }) {
  const http = axios.create({
    baseURL: `https://${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/`,
    headers: { 'Access-Control-Allow-Origin': '*', Authorization: accessToken },
  });

  return http.request({
    method: 'patch',
    url: `/users/${id}`,
    data,
    ...customReqConfig,
  });
}

export function getSignature({ id, params, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'get',
    url: `users/${id}/signatures`,
    params,
    responseType: 'blob',
    ...customReqConfig,
  });
}

export function setSignature({ id, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'put',
    url: `users/${id}/signatures`,
    data,
    ...customReqConfig,
  });
}

export function deleteSignature({ id, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'delete',
    url: `users/${id}/signatures`,
    ...customReqConfig,
  });
}
