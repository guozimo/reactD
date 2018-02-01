import { message } from 'antd';
import * as memberTypeService from '../../services/member/memberMainContent';
import { getUserInfo } from '../../utils';

export default {
  namespace: 'memberType',
  state: {
    list: [],
    success: false,
  },
  reducers: {
    showError(state, { msg }) {
      message.error(msg);
      return {
        ...state,
      };
    },
    showSuccess(state, { success }) {
      return {
        ...state,
        success,
      };
    },
    memberList(state, { list }) {
      return {
        ...state,
        list,
      };
    },
  },
  effects: {
    * fetchList(payload, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(memberTypeService.fetchList, {
        tenantId: memberTenantId.tenantId,
      });
      if (data.success) {
        yield put({
          type: 'memberList',
          list: data.data,
        });
      }
    },
    * addMemberType({ values }, { call, put }) {
      const { data } = yield call(memberTypeService.addMemberType, values);
      if (data.success) {
        yield put({
          type: 'fetchList',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
        yield put({
          type: 'showSuccess',
          success: false,
        });
      }
    },
    * editMemberType({ values }, { call, put }) {
      const { data } = yield call(memberTypeService.editMemberType, values);
      if (data.success) {
        yield put({
          type: 'fetchList',
        });
      } else {
        // console.log(data);
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
      }
    },
    * deleteMemberType({ values }, { call, put }) {
      const { data } = yield call(memberTypeService.deleteMemberType, values);
      if (data.success) {
        // console.log(data);
        yield put({
          type: 'fetchList',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/member/memberType') {
          dispatch({
            type: 'fetchList',
          });
        }
      });
    },
  },
};
