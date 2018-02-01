import request from '../../utils/request';

export default function fetchList() {
  return request('/ipos-chains/aclStore/queryStoreServiceInfoByUser');
}
