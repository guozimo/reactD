import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/cut/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryTree(params) {
  return request('/ipos-chains/scm/goodsCategory/findTreeList', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryGoods(params) {
  return request('/ipos-chains/scm/goods/findDataForPage', {
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

export async function exports(params) {
  const url = '/ipos-chains/scm/export/exportScmCut?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}
