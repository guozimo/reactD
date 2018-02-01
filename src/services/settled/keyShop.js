import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function getProvince() {
  return request('/ipos-chains/basKbShop/getGBDistrictListByCityCode');
}

export function getDistrict(query) {
  return request(`/ipos-chains/basKbShop/getGBDistrictListByCityCode?${paramFormat(query)}`);
}

export function getKbCategoryList() {
  return request('/ipos-chains/basKbShop/getKbCategoryList');
}

export function getSecondCategoryList(query) {
  return request(`/ipos-chains/basKbShop/getKbCategoryList?${paramFormat(query)}`);
}

export function create(values) {
  return request('/ipos-chains/basKbShop/createShop', {
    body: JSON.stringify(values),
  });
}

export function delShopImg(values) {
  return request('/ipos-chains/basKbShop/delShopImg', {
    body: JSON.stringify(values),
  });
}

export function getStoreData(values) {
  return request('/ipos-chains/basKbShop/findKbShopByStoreId', {
    body: JSON.stringify(values),
  });
}
