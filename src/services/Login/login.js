import request from '../../utils/request';
// 登录
export function login(values) {
  return request(`/ipos-chains/login?password=${values.password}&username=${values.username}`);
}
// 退出登录
export function logout() {
  return request('/ipos-chains/logout');
}
// 获取权限
export function getAuthority() {
  return request('/ipos-chains/aclStore/queryAuthority');
}
