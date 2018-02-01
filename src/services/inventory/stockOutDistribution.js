
import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/supplyGoods/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function findAclStoreForPage(params) {
  return request('/ipos-chains/scm/depot/findOrgInfoForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function queryOutDistribution(params) {
  return request('/ipos-chains/scmzb/scmDispatchOut/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function addScmDirectManual(params) {
  return request('/ipos-chains/scmzb/scmDirect/addScmDirectManual', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}


export async function updateScmDirectManual(params) {
  return request('/ipos-chains/scmzb/scmDirect/update', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function queryExport(params) {
  // console.warn("params",params);
  const url = '/ipos-chains/scmzb/export/exportScmDispatchOut?conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}


export async function closeScmDirect(params) {
  return request('/ipos-chains/scmzb/scmDirect/closeScmDirect', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
