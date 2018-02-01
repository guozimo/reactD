import request from '../../utils/request';

// 查找调拨订单
export async function query(params) {
  return request('/ipos-chains/scmzb/report/loadZbGoodsDetailsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 导出
export async function exportAnItem(params) {
  let conditionJsonStr = `{"storeId":"${params.storeId}","startDate":"${params.startDate}","endDate":"${params.endDate}"}`;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=zbStockInOutSummaryExport&conditionJsonStr=${conditionJsonStr}&rows=undefined&page=undefined&isAll=1`;
  window.open(url);
}
