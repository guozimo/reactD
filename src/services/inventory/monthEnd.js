import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/monthEnd/findDataForPage', {
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
