import request from '../../utils/request';
import { paramFormat } from '../../utils';

export function send(mobile) {
  // console.log(mobile);
  return request(`/ipos-chains/resetPassword/sentAuthCodeForResetPassword?${paramFormat(mobile)}`);
}

export function create(values) {
  return request(`/ipos-chains/resetPassword/resetPassword?${paramFormat(values)}`);
}
