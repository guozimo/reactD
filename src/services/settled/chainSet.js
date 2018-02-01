import request from '../../utils/request';
import { param } from '../../utils';
// 门店集合
export function getAclStoreListSecond() {
  return request('/ipos-chains/aclStore/list');
}
// 门店详情列表
export function findAclStoreForPage(values) {
  const formdata = {
    formdata: param(values),
  };
  return request('/ipos-chains/aclStore/findAclStoreForPage', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
// 编辑查看门店
export function storeUpdateForm({ id }) {
  return request(`/ipos-chains/aclStore/updateForm/${id}`);
}
// 选择省份
export function getAddress({ id }) {
  return request(`/ipos-chains/aclStore/site/${id}`);
}
// 保存门店编辑
export function saveEditStore(values) {
  const formdata = {
    formdata: param(values),
  };
  return request('/ipos-chains/aclStore/updAclStoreInfo/', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
// 配送中心门店列表
export function getDcStoreListSecond(values) {
  return request('/ipos-chains/aclOrgInfo/list', {
    body: JSON.stringify(values),
  });
}
// 配送中心门店详情列表
export function findDcStoreForPage(values) {
  return request('/ipos-chains/aclOrgInfo/findDistributionByPage', {
    body: JSON.stringify(values),
  });
}
export function dcUpdateForm({ id }) {
  return request(`/ipos-chains/aclOrgInfo/updateForm/${id}`);
}
export function saveEditDc(values) {
  return request('/ipos-chains/aclOrgInfo/update', {
    body: JSON.stringify(values),
  });
}
// 查询modal选择数据
export function aclDistributionStore(values) {
  return request('/ipos-chains/aclDistributionStore/findStoreForAssign', {
    body: JSON.stringify(values),
  });
}
// 保存modal编辑数据
export function assignOrCancelStore(values) {
  return request('/ipos-chains/aclDistributionStore/assignOrCancelStore', {
    body: JSON.stringify(values),
  });
}
