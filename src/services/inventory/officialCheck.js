import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scmzb/Check/findDataForPage', { // 查询盘点单
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
  return request('/ipos-chains/scmzb/Check/delScmCheck', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}

export async function exportAnItem(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scmzb/export/exportScmCheck?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}

export async function fetchOrgInfo(params) {
  return request('/ipos-chains/scm/applyorder/checkOrgInfo', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
