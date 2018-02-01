import request from '../../utils/request';

export async function getCurrUser(params) {
  return request('/ipos-chains/scm/applyorder/username', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function getDetailList(params) {
  return request('/ipos-chains/scmzb/Check/updForm', {
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
  return request('/ipos-chains/scmzb/Check/addScmCheck', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function updateDetails(params) {
  return request('/ipos-chains/scmzb/Check/updScmCheck', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function getDetailListByCheckType(params) {
  return request('/ipos-chains/scmzb/Check/findScmCheckGoodsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
