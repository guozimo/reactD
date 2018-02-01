import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/supplyGoods/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryList(params) {
  return request('/ipos-chains/scmzb/in/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scmzb/in/delScmZbIn', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryDetailList(params) {
  return request('/ipos-chains/scmzb/in/updForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function addStockIn(params) {
  return request('/ipos-chains/scmzb/in/addScmZbIn', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}

export async function updStockIn(params) {
  return request('/ipos-chains/scmzb/in/updScmZbIn', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}

// 总部入库导出
export async function zbExport(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scmzb/export/exportScmIn?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}
// 入库新增
export async function addForm(params) {
  return request('/ipos-chains/scmzb/in/addForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
