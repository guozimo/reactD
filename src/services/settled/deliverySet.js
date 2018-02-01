import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function getCircle(query) {
  return request(`/ipos-chains/aclStore/getCircle?${paramFormat(query)}`);
}

export function create(values) {
  return request('/ipos-chains/aclOrgInfo/saveDistributionCenter', {
    body: JSON.stringify(values),
  });
}

export function getCookStyle(values) {
  return request(`/ipos-chains/aclStore/getCookStyle?${paramFormat(values)}`);
}

