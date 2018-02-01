import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/tax/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function checkIfRefed(params) {
  return request('/ipos-chains/scm/tax/updForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/tax/addTax', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  console.log('====payload', params);
  return request(`/ipos-chains/aclEmployee/delAclEmployeeById/${params}`);
}

export async function update(params) {
  return request('/ipos-chains/scm/tax/updTax', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
