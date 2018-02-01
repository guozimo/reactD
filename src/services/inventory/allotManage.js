import request from '../../utils/request';

// 请求门店
export async function findAclStoreForPage(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 查找调拨订单
export async function query(params) {
  return request('/ipos-chains/scmzb/transfer/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 调拨新增
export async function addForm(params) {
  return request('/ipos-chains/scmzb/transfer/addForm/', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 调拨新增保存
export async function addScmTransfer(params) {
  return request('/ipos-chains/scmzb/transfer/addScmZbTransfer', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


// 调拨修改查询
export async function updateForm(params) {
  return request('/ipos-chains/scmzb/transfer/updForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 调拨修改保存
export async function updScmTransfer(params) {
  return request('/ipos-chains/scmzb/transfer/updScmZbTransfer', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


// 调拨删除
export async function delScmTransfer(params) {
  return request('/ipos-chains/scmzb/transfer/delScmZbTransfer', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
