import request from '../../utils/request';

export async function query(params) {
  return request('/ipos-chains/scm/report/loadCostAnalysisData', {
    method: 'post',
    body: JSON.stringify(params),
  });
}

export default query;
