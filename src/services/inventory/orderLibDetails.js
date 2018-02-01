import request from '../../utils/request';

export async function getCurrUser(params) {
  return request('/ipos-chains/scm/applyorder/username', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function getDetailList(params) {
  return request('/ipos-chains/scmzb/OrderCenter/findDataDetail', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function getSplitingDetailList(params) {
  return request('/ipos-chains/scmzb/OrderCenter/findSplitDetail', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function queryGoodsByString(params) {
  return request('/ipos-chains/scm/in/findScmInGoodsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function doItInProgress(params) {
  return request('/ipos-chains/scmzb/OrderCenter/addScmOrderCenter', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
