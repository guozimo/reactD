import request from '../../utils/request';

export function memberTypeList(values) {
  return request('/ipos-chains/member/memberType/getTypesByTenantId', {
    body: JSON.stringify(values),
  });
}
export function consumeReport(values) {
  return request('/ipos-chains/memberReport/consumeReport', {
    body: JSON.stringify(values),
  });
}

export function aclStoreList(values) {
  return request('/ipos-chains/aclStore/list', {
    body: JSON.stringify(values),
  });
}

export function exportExcel(values) {
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=consumeExport&conditionJsonStr=${values.values}&isAll=1`;
  window.open(url);
}
