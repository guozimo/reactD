import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scmzb/supplierType/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scmzb/supplierType/add', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scmzb/supplierType/delete', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scmzb/supplierType/update', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
