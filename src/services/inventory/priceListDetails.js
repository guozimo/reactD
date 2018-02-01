import request from '../../utils/request';

export async function getCurrUser(params) {
  return request('/ipos-chains/scm/applyorder/username', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function getDetailList(params) {
  return request('/ipos-chains/scmzb/deliverPrice/updForm', {
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
  return request('/ipos-chains/scmzb/deliverPrice/addScmZbDeliverPrice', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function updateDetails(params) {
  return request('/ipos-chains/scmzb/deliverPrice/updScmZbDeliverPrice', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
export async function queryGoodsForPriceList(params) {
  return request('/ipos-chains/scm/goods/findGoodsByRelation', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function findTreeListForPriceList(params) {
  return request('/ipos-chains/scm/goodsCategory/findTreeListRelation', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
