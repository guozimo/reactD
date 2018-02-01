import { message } from 'antd';
import * as rechargeRule from '../../services/member/rechargeRule';
import { getUserInfo } from '../../utils';

export default {
  namespace: 'rechargeRule',
  state: {
    list: [],
  },
  reducers: {
    showSuccess(state, { msg }) {
      message.success(msg);

      return {
        ...state,
      };
    },
    showError(state, { msg }) {
      message.error(msg);
      return {
        ...state,
      };
    },
    memberTypeList(state, { typeList }) {
      return {
        ...state,
        typeList,
      };
    },
    list(state, { list }) {
      return {
        ...state,
        list,
      };
    },
  },
  effects: {
    * memberTypeListData(payload, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(rechargeRule.memberTypeList, {
        tenantId: memberTenantId.tenantId,
      });
      if (data.success) {
        yield put({
          type: 'memberTypeList',
          typeList: data.data,
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message,
        });
      }
    },
    * fetchList({ values }, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(rechargeRule.list, {
        tenantId: memberTenantId.tenantId,
        ...values,
      });
      if (data.success) {
        const list = data.data.data;
        list.forEach((item) => {
          const value = item;
          value.maxVol /= 100;
          value.minVol /= 100;
          if (value.recharge) {
            value.recharge /= 100;
          }
        });
        yield put({
          type: 'list',
          list: data.data,
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
      }
    },
    * addList({ values }, { call, put }) {
      const { data } = yield call(rechargeRule.addList, {
        ...values,
      });
      if (data.success) {
        yield put({
          type: 'showSuccess',
          msg: '新增成功',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
      }
    },
    * editList({ values }, { call, put }) {
      const { data } = yield call(rechargeRule.editList, {
        ...values,
      });
      if (data.success) {
        // console.log(data);
        yield put({
          type: 'showSuccess',
          msg: '编辑成功',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.errorInfo,
        });
      }
    },
    * deleteList({ values }, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(rechargeRule.deleteList, {
        tenantId: memberTenantId.tenantId,
        ...values,
      });
      if (data.success) {
        // console.log(data);
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/member/rechargeRule') {
          dispatch({
            type: 'memberTypeListData',
          });
          dispatch({
            type: 'fetchList',
            values: {
              memberTypeId: '',
              rows: 10,
              page: 1,
            },
          });
        }
      });
    },
  },
};
