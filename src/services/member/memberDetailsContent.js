import request from '../../utils/request';

export function fetchList(values) {
  return request('/ipos-chains/member/memberInfo/loadDataForPage', {
    body: JSON.stringify(values),
  });
}
export function searchList(values) {
  return request('/ipos-chains/member/memberInfo/search', {
    body: JSON.stringify(values),
  });
}
export function memberTypeList(values) {
  return request('/ipos-chains/member/memberType/getTypesByTenantId', {
    body: JSON.stringify(values),
  });
}
export function updateStatus(values) {
  return request('/ipos-chains/member/memberInfo/updateStatus', {
    body: JSON.stringify(values),
  });
}

export function downloadTemplate() {
  return request('/ipos-chains/member/memberInfo/downloadMember');
}
