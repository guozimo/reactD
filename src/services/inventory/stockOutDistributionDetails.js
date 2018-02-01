import request from '../../utils/request';

export async function queryDetailList(params) {
  return request('/ipos-chains/scmzb/out/updForm', {
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

export async function addStockOut(params) {
  return request('/ipos-chains/scmzb/out/addScmOut', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scmzb/scmDispatchOut/toUpdate', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function updStockOut(params) {
  return request('/ipos-chains/scmzb/scmDispatchOut/addScmDispatchOut', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
