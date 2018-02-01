import request from '../../utils/request';
import { param } from '../../utils';
// 列表
export function authorityList(values) {
  const formdata = {
    formdata: param(values),
  };
  return request('/ipos-chains/basPost/findBasPostForPage', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
// 修改状态 启用 停用
export function updateAuthStatus(values) {
  const formdata = {
    formdata: param(values),
  };
  return request('/ipos-chains/basPost/updStatus', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
// 删除
export function deleteAuthority(values) {
  return request(`/ipos-chains/basPost/delBasPostById/${values.id}`);
}
// 权限列表
export function getAuthority() {
  return request('/ipos-chains/basPost/permission');
}
// 新建岗位权限
export function addBasPost(values) {
  return request('/ipos-chains/basPost/addBasPost', {
    body: JSON.stringify(values),
  });
}
// 编辑查询
export function editBasPost(values) {
  return request(`ipos-chains/basPost/info/${values.id}`);
}
// 编辑保存
export function updBasPost(values) {
  return request('/ipos-chains/basPost/updBasPost', {
    body: JSON.stringify(values),
  });
}
