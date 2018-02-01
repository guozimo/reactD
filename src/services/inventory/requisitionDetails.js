import request from '../../utils/request';

export async function getCurrUser(params) {
  return request('/ipos-chains/scm/applyorder/username', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function getDetailList(params) {
  return request('/ipos-chains/scmzb/OrderCenter/findSplitDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function toupdate(params) {
  return request('/ipos-chains/scm/applyorder/toupdate', {
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
export async function saveDetails(params) {
  return request('/ipos-chains/scm/applyorder/add', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function updateDetails(params) {
  return request('/ipos-chains/scm/applyorder/update', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
