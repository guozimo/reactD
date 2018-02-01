import request from '../../utils/request';


export async function query(params) {
  return request('/ipos-chains/scmzb/scmdepotgoods/findDataForPage', {
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
export async function check(params) {
  return request('/ipos-chains/scmzb/scmdepotgoods/check', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function addDepot(params) {
  return request('/ipos-chains/scmzb/scmdepotgoods/add', {
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
  return request('/ipos-chains/scmzb/scmdepotgoods/delete', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
