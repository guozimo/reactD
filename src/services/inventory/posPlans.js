import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('ipos-chains/scm/posItemPlan/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/posItemPlan/addScmPosItemPlan', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/posItemPlan/findPosItemPlan', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exports(params) {
  const url = '/ipos-chains/scm/export/exportPlan?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}

