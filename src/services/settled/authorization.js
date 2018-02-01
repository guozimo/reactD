import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function fetchList() {
  return request('/ipos-chains/auth/getAuthInfo');
}

export function getMeiTuanList() {
  return request('/ipos-chains/auth/findMeituanAuth');
}

export function elemeListShop(query) {
  return request(`/ipos-chains/elemeOAuth/listShops?${paramFormat(query)}`);
}

export function bindElemeShop(values) {
  return request('/ipos-chains/elemeOAuth/bindElemeShop', {
    body: JSON.stringify(values),
  });
}

export function findElemeShops() {
  return request('/ipos-chains/elemeOAuth/findBindElemeShops');
}

export function getStoreList() {
  return request('/ipos-chains/aclStore/list');
}
