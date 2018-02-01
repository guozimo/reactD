import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/scmUtilities/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}


export async function create(params) {
  return request('/ipos-chains/scm/scmUtilities/addScmUtilities', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scm/scmUtilities/delScmUtilities', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/scmUtilities/updateScmUtilities', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

