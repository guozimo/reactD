import request from '../../utils/request';

export async function getCurrUser(params) {
  return request('/ipos-chains/scm/applyorder/username', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function getDetailList(params) {
  return request('/ipos-chains/scm/scmstoredirect/toaudit', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function sawDetailList(params) {
  return request('/ipos-chains/scm/scmstoredirect/info', {
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
  return request('/ipos-chains/scm/scmstoredirect/audit', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
