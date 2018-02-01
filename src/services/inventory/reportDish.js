import request from '../../utils/request';
import { paramFormatJson } from '../../utils';

export async function query(params) {
  return request('/ipos-chains/scm/report/loadDishGrossData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export async function exports(params) {
  const url = '/ipos-chains/exportData/exportExcel?busiDataType=scmDishGrossAnalysisDataExport&conditionJsonStr=%7B'.concat(paramFormatJson(params), '%7D');
  window.open(url);
}
