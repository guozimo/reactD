import request from '../../utils/request';

// 请求服务器时间
export async function queryTime(params) {
  return request('/ipos-chains/report/getNowDate', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求门店列表
export async function queryDepot(params) { // 门店用，无需机构
  return request('/ipos-chains/scm/depot/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求机构列表
export async function queryOrg(params) {
  // 总部用，可以查询机构也可以查询门店，用于查询总部之下的门店时 需使用此接口
  // 和aclStoreList并列的，orgType是1就是门店接口，orgType是2 就是总部机构接口
  // params.orgType:1 门店 2:总部        请求总部，传1;请求门店，传2
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求供应商
export async function querySupplier(params) {
  return request('/ipos-chains/scm/supplier/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求仓库
export async function queryWarehouse(params) {
  return request('/ipos-chains/scm/depot/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求物资
export async function queryGoodsID(params) {
  return request('/ipos-chains/scm/in/findScmInGoodsData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 请求配送关系物资
export async function queryGoodsRelation(params) {
  return request('/ipos-chains/scm/goods/findGoodsByRelation', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 请求单据类型
export async function queryType(params) {
  return request('/ipos-chains/report/param/getDictDataByType', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
// 获取物资树
export async function findTreeList(params) {
  return request('/ipos-chains/scm/goodsCategory/findTreeList', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 获取机构
export async function findAclStoreForPage(params) {
  return request('/ipos-chains/aclStore/findAclStoreForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 总部入库反审核物资
export async function zbReverse(params) {
  return request('/ipos-chains/scmzb/in/reverseAudit', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

// 总部出库反审核物资
export async function zbOutReverse(params) {
  return request('/ipos-chains/scmzb/out/reverseAudit', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
