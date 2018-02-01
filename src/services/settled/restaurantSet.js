import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function getCircle(query) {
  return request(`/ipos-chains/aclStore/getCircle?${paramFormat(query)}`);
}

export function create(values) {
  return request('/ipos-chains/aclStore/createStore', {
    body: JSON.stringify(values),
  });
}

export function getCookStyle(values) {
  return request(`/ipos-chains/aclStore/getCookStyle?${paramFormat(values)}`);
}

export function getYeTai() {
  return request('/ipos-chains/aclTenant/getYeTai');
}

export function getData() {
  return request('/ipos-chains/aclTenant/info');
}

