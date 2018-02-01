import request from '../../utils/request';


export function create(values) {
  return request('/ipos-chains/bas/printer/setPriteImageAndExplain', {
    body: JSON.stringify(values),
  });
}

export function getData(values) {
  return request('/ipos-chains/bas/printer/findPriteImageAndExplain', {
    body: JSON.stringify(values),
  });
}

export function getStoreList() {
  return request('/ipos-chains/aclStore/list');
}
