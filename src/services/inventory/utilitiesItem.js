import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/scmUtilities/findAllScmUtilitiesDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function queryForm(params) {
  return request('/ipos-chains/scm/scmUtilities/addDetailForm', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/scmUtilities/addScmUtilitiesDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scm/scmUtilities/deleteScmUtilitiesDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/scmUtilities/updateScmUtilitiesDetail', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

