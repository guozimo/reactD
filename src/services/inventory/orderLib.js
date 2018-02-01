import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scmzb/OrderCenter/findDataForPage', {
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

export async function retreatAnItem(params) {
  return request('/ipos-chains/scmzb/OrderCenter/retScmApplyOrder', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}

export async function exportAnItem(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scm/export/exportApplyOrder?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}
