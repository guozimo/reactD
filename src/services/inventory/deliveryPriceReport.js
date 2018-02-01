import request from '../../utils/request';

export async function queryList(params) {
  return request('/ipos-chains/scmzb/deliverPrice/findDetailDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function cancelBills(params) {
  return request('/ipos-chains/scmzb/deliverPrice/scmZbDeliverPriceDetailCancel', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

