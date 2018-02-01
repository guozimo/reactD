import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/forecast/findForecastByDate', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryChart(params) {
  return request('/ipos-chains/scm/forecast/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 请求门店列表
export async function queryDepot(params) {
  return request('/ipos-chains/scm/depot/findDataForforeCast', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function create(params) {
  return request('/ipos-chains/scm/forecast/addForecast', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scm/forecast/delForecast', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/forecast/updForecast', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exports(params) {
  const url = '/ipos-chains/scm/export/exportForecast?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}
