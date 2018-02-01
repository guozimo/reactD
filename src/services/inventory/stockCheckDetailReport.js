import request from '../../utils/request';

// 导出表格
export async function exportAnItem(params) {
  let conditionJsonStr = `{"storeId":"${params.storeId}","startDate":"${params.startDate}","endDate":"${params.endDate}"}`;
  // console.warn('------id--------', params.id);
  // return false;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=zbStockInOutSummaryExport&conditionJsonStr=${conditionJsonStr}&rows=undefined&page=undefined&isAll=1`;
  window.open(url);
}

// 查找表格
export async function getList(params) {
  return request('/ipos-chains/scmzb/report/loadZbCheckDetailsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
