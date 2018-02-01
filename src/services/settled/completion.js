import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function getProvince() {
  return request('/ipos-chains/aclStore/getProvinceList');
}

export function getDistrict(query) {
  return request(`/ipos-chains/aclStore/getDistrict?${paramFormat(query)}`);
}

export function create(values) {
  return request('/ipos-chains/aclTenant/createTenant', {
    body: JSON.stringify(values),
  });
}

export function getYeTai() {
  return request('/ipos-chains/aclTenant/getYeTai');
}

export function getData() {
  return request('/ipos-chains/aclTenant/info');
}

export function getAuthority() {
  return request('/ipos-chains/aclStore/queryAuthority');
}
