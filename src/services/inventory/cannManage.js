import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scm/applyorder/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryChangeMonthEnd(params) {
  return request('/ipos-chains/scm/monthEnd/updateMonthEnd', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function deleteAnItem(params) {
  return request('/ipos-chains/scm/applyorder/delete', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exportAnItem(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  // console.warn('------id--------', params.id);
  // return false;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scmzb/export/exportScmTransfer?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}


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
  return request('/ipos-chains/scmzb/transfer/addForm', {
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

export async function getDetailList(params) {
  return request('/ipos-chains/scm/applyorder/toupdate', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function queryGoodsByString(params) {
  return request('/ipos-chains/scm/in/findScmInGoodsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function saveDetails(params) {
  return request('/ipos-chains/scm/applyorder/add', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function updateDetails(params) {
  return request('/ipos-chains/scm/applyorder/update', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
