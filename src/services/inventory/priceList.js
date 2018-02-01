import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scmzb/deliverPrice/findDataForPage', {
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
  return request('/ipos-chains/scmzb/deliverPrice/delScmZbDeliverPrice', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function abolishAnItem(params) {
  return request('/ipos-chains/scmzb/deliverPrice/scmZbDeliverPriceBillCancel', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exportAnItem(params) {
  let conditionJsonStr = `{"id":"${params.id}","storeId":"${params.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scm/export/exportApplyOrder?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}

export async function fetchOrgInfo(params) {
  return request('/ipos-chains/scm/applyorder/checkOrgInfo', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
