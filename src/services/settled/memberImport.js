import request from '../../utils/request';
import { param } from '../../utils';
// import { paramFormat } from '../../utils';

export function downloadCategory() {
  return request('/ipos-chains/acl/uploadFile/downloadCategory');
}

export function findDataForPage() {
  return request('ipos-chains/acl/uploadFile/findDataForPage');
}

export function downloadDish() {
  return request('/ipos-chains/acl/uploadFile/downloadDish');
}

export function downloadTableQu() {
  return request('/ipos-chains/acl/uploadFile/downloadTableQu');
}

export function downloadTable() {
  return request('/ipos-chains/acl/uploadFile/downloadTable');
}
export function memberInfo(data) {
  const formdata = {
    formdata: param(data),
  };
  return request('ipos-chains/aclEmployee/findAclEmployeeForPage', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },


  });
}
export function showTree() {
  return request('ipos-chains/aclOrgInfo/allOrgList');
}
export function updateStatus(data) {
  const formdata = {
    formdata: param(data),
  };
  return request('ipos-chains/aclEmployee/updStatus', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
export function resetPwd(data) {
  return request(`ipos-chains/aclEmployee/updResetPassword/${data}`);
}

export function getArea() {
  return request('ipos-chains/aclEmployee/createForm');
}
export function getSecondArea(data) {
  return request(`ipos-chains/aclStore/site/${data}`);
}

export function addAclEmployee(data) {
  const formdata = {
    formdata: param(data),
  };
  return request('ipos-chains/aclEmployee/addAclEmployee', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
export function updateEmployee(data) {
  const formdata = {
    formdata: param(data),
  };
  return request('ipos-chains/aclEmployee/updAclEmployee', {
    body: JSON.stringify(formdata),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}
export function restStore(data) {
  return request('ipos-chains/aclEmployee/getEmpCodeByStoreId', {
    body: JSON.stringify(data),
  });
}
export function updateForm(data) {
  return request(`ipos-chains/aclEmployee/updateForm/${data}`);
}
