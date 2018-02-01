import request from '../../utils/request';
import { paramFormat } from '../../utils';

export default function create(values) {
  return request(`/ipos-chains/updPassword?${paramFormat(values)}`);
}
