import request from '../../utils/request';
// import { paramFormat } from '../../utils';

export function memberTypeList(values) {
  return request('/ipos-chains/member/memberType/getTypesByTenantId', {
    body: JSON.stringify(values),
  });
}

export function rechargeReport(values) {
  return request('/ipos-chains/memberReport/rechargeReport', {
    body: JSON.stringify(values),
  });
}

export function aclStoreList(values) {
  return request('/ipos-chains/aclStore/list', {
    body: JSON.stringify(values),
  });
}

export function exportExcel(values) {
  const url = `/ipos-chains/exportData/exportExcel?busiDataType=rechargeExport&conditionJsonStr=${values.values}&isAll=1`;
  window.open(url);
}

