import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scmzb/scmDirect/findDataDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 请求门店
export async function findAclStoreForPage(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exportAnItem(params) {
  const originId = params.originId;
  const storeId = params.storeId;
  const busiId = params.busiId;
  const goodsName = params.goodsName;
  const startDate = params.startDate;
  const endDate = params.endDate;
  let conditionJsonStr = `{"distribId":"${originId}","storeId":"${storeId}","busiId":"${busiId}","goodsName":"${goodsName}","startDate":"${startDate}","endDate":"${endDate}"}`;
  // console.warn('------id--------', params.id);
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  console.log(conditionJsonStr);
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=zbDirectReportExport&conditionJsonStr=${conditionJsonStr}&rows=undefined&page=undefined&isAll=1`;
  window.open(url);
}
