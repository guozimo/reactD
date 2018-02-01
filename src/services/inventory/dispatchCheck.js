import request from '../../utils/request';

// 搜索页面查找表格
export async function fetchList(params) {
  return request('/ipos-chains/scm/scmStoreDispatch/findDataForPage', {
    method: 'post',
    // needToken: true,
    body: JSON.stringify(params),
  });
}

// 查看或验收页面获取列表值
export async function getDetailList(params) {
  return request('/ipos-chains/scm/scmStoreDispatch/auditForm', {
    method: 'post',
    // needToken: true,
    body: JSON.stringify(params),
  });
}
// 验收页面验收接口
export async function saveDetails(params) {
  return request('/ipos-chains/scm/scmStoreDispatch/auditDispatch', {
    method: 'post',
    needToken: true,
    body: JSON.stringify(params),
  });
}
