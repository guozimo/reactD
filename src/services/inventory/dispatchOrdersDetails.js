import request from '../../utils/request';

export async function queryDetailList(params) {
  return request('/ipos-chains/scmzb/scmDispatch/toUpdate', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryGoodsByString(params) {
  return request('/ipos-chains/scm/in/findScmInGoodsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function updDispatchOrders(params) {
  return request('/ipos-chains/scmzb/scmDispatch/update', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
