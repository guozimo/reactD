import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/order/findDataForPage', {
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


export async function queryAddPurchase(params) {
  return request('/ipos-chains/scm/order/addScmOrder', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function queryfind(params) {
  return request('/ipos-chains/scm/order/updForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryExport(params) {
  const url = '/ipos-chains/scm/export/exportScmOrder?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}
