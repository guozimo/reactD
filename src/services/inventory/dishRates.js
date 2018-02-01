import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/dishRates/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/dishRates/addRates', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/dishRates/findRates', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function exports(params) {
  const url = '/ipos-chains/scm/export/exportRates?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}
