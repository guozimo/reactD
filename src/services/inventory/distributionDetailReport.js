import request from '../../utils/request';

export async function exportAnItem(params) {
  const distribId = params.distribId;
  const storeId = params.storeId;
  const depotId = params.depotId;
  const goodsName = params.goodsName;
  const startDate = params.startDate;
  const endDate = params.endDate;
  let conditionJsonStr = `{"distribId":"${distribId}","storeId":"${storeId}","depotId":"${depotId}","goodsName":"${goodsName}","startDate":"${startDate}","endDate":"${endDate}"}`;
  // return false;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  console.log(conditionJsonStr);
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=zbDispatchReportExport&conditionJsonStr=${conditionJsonStr}&rows=undefined&page=undefined&isAll=1`;
  window.open(url);
}
// 请求机构
export async function findAclStoreForPage(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function query(params) {
  return request('/ipos-chains/scmzb/scmDispatch/findDataDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
