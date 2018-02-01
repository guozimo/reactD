import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/scrap/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function create(params) {
  return request('/ipos-chains/scm/scrap/addScrap', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function remove(params) {
  return request('/ipos-chains/scm/scrap/delScrap', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function update(params) {
  return request('/ipos-chains/scm/scrap/updScrap', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

