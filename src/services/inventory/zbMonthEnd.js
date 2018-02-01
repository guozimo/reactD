import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scmzb/monthEnd/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求门店列表
export async function queryDepot(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function queryChangeMonthEnd(params) {
  return request('/ipos-chains/scmzb/monthEnd/updateMonthEnd', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
