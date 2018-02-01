import request from '../../utils/request';
// import { paramFormat } from '../../utils';

export function downloadCategory() {
  return request('/ipos-chains/acl/uploadFile/downloadCategory');
}

export function findDataForPage() {
  return request('ipos-chains/acl/uploadFile/findDataForPage');
}

export function downloadDish() {
  return request('/ipos-chains/acl/uploadFile/downloadDish');
}

export function downloadTableQu() {
  return request('/ipos-chains/acl/uploadFile/downloadTableQu');
}

export function downloadTable() {
  return request('/ipos-chains/acl/uploadFile/downloadTable');
}

