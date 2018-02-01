import request from '../../utils/request';

export async function exportAnItem(params) {
  const conditionJsonData = {
    storeId: params.storeId,
    goodsName: params.goodsName,
    depotId: params.depotId,
    cateId: params.cateId,
    startDate: params.startDate,
    endDate: params.endDate,
  };
  let conditionJsonStr = JSON.stringify(conditionJsonData);
  // console.warn('------id--------', params.id);
  // return false;
  conditionJsonStr = encodeURIComponent(conditionJsonStr);
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=zbStockInOutSummaryExport&conditionJsonStr=${conditionJsonStr}&rows=undefined&page=undefined&isAll=1`;
  window.open(url);
}


// 请求门店
export async function findAclStoreForPage(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 查找调拨订单
export async function query(params) {
  return request('/ipos-chains/scmzb/report/loadZbDailyData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


// 调拨新增保存
export async function addScmTransfer(params) {
  return request('/ipos-chains/scmzb/transfer/addScmZbTransfer', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
