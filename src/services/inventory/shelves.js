import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/shelves/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/shelves/addShelves', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scm/shelves/delShelves', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/shelves/updShelves', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

