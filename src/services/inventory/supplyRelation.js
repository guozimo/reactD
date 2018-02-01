import request from '../../utils/request';


export async function query(params) {
  return request('/ipos-chains/scm/supplyGoods/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function check(params) {
  return request('/ipos-chains/scm/supplyGoods/checkDepotGoods', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function findAclStoreForPage(params) {
  return request('/ipos-chains/aclStore/findAclStoreForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function addSupplyGoods(params) {
  return request('/ipos-chains/scm/supplyGoods/addSupplyGoods', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


export async function findGoodsBySupplier(params) {
  return request('/ipos-chains/scm/supplyGoods/findGoodsBySupplier', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function addPriorityByOne(params) {
  return request('/ipos-chains/scm/supplyGoods/addPriorityByOne', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


export async function addSupplyPriority(params) {
  return request('/ipos-chains/scm/supplyGoods/addSupplyPriority', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


export async function delSupplyGoods(params) {
  return request('/ipos-chains/scm/supplyGoods/delSupplyGoodsByBatch', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
