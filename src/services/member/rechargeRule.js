import request from '../../utils/request';

export function memberTypeList(values) {
  return request('/ipos-chains/member/memberType/getTypesByTenantId', {
    body: JSON.stringify(values),
  });
}
export function list(values) {
  return request('/ipos-chains/member/rechargeRule/loadDataForPage', {
    body: JSON.stringify(values),
  });
}
export function addList(values) {
  return request('/ipos-chains/member/rechargeRule/add', {
    body: JSON.stringify(values),
  });
}
export function editList(values) {
  return request('/ipos-chains/member/rechargeRule/update', {
    body: JSON.stringify(values),
  });
}
export function deleteList(values) {
  return request('/ipos-chains/member/rechargeRule/delete', {
    body: JSON.stringify(values),
  });
}
