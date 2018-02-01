import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scmzb/out/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function fetchAngencyList(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function deleteAnItem(params) {
  return request('/ipos-chains/scmzb/out/delScmOut', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scmzb/out/delScmOut', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 总部出库导出
export async function zbExport(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scmzb/export/exportScmOut?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}
