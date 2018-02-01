import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function create(values) {
  return request('/ipos-chains/aclTenant/createTenantUser', {
    body: JSON.stringify(values),
  });
}

export function send(mobile) {
  return request('/ipos-chains/aclTenant/sendRegisterSMS', {
    body: JSON.stringify(mobile),
  });
}

export function verify(mobile) {
  return request(`/ipos-chains/aclTenant/checkUserByAccount?${paramFormat(mobile)}`);
}

