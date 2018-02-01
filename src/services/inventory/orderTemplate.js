import request from '../../utils/request';

export async function fetchList(params) {
  return request('/ipos-chains/scmzb/scmtemplate/findDataForPage', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function addTemplate(params) {
  return request('/ipos-chains/scmzb/scmtemplate/add', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function uploadTemplates(params) {
  return request('/ipos-chains/scmzb/scmtemplate/upload', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function disabledOrNot(params) {
  return request('/ipos-chains/scmzb/scmtemplate/updateStatus', {
    method: 'post',
    body: JSON.stringify(params),
  });
}
