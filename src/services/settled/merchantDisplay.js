import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function getProvince() {
  return request('/ipos-chains/aclStore/getProvinceList');
}

export function getDistrict(query) {
  return request(`/ipos-chains/aclStore/getDistrict?${paramFormat(query)}`);
}

export function getData() {
  return request('/ipos-chains/aclTenant/info');
}
export function getAuthority() {
  return request('/ipos-chains/aclStore/queryAuthority');
}
