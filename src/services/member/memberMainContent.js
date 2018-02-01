import request from '../../utils/request';

export function fetchList(values) {
  return request('/ipos-chains/member/memberType/getTypesByTenantId', {
    body: JSON.stringify(values),
  });
}
export function addMemberType(values) {
  return request('/ipos-chains/member/memberType/add', {
    body: JSON.stringify(values),
  });
}
export function editMemberType(values) {
  return request('/ipos-chains/member/memberType/update', {
    body: JSON.stringify(values),
  });
}
export function deleteMemberType(values) {
  return request('/ipos-chains/member/memberType/delete', {
    body: JSON.stringify(values),
  });
}
