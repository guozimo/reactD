import request from '../../utils/request';

export async function queryStoreList(params) { // 请求列表数据
  return request('/ipos-chains/scmzb/scmDispatch/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryExport(params) { // 导出
  let conditionJsonStr = `{"id":"${params.payload.id}","storeId":"${params.payload.storeId}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/scmzb/export/exportScmDispatch?conditionJsonStr=${conditionJsonStr}`;
  window.open(url);
}

export async function closeScmDirect(params) {
  return request('/ipos-chains/scmzb/scmDispatch/closeScmDispatch', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
