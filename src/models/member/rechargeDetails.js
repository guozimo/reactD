// import { message } from 'antd';
import * as rechargeDetails from '../../services/member/rechargeDetails';
import { getUserInfo } from '../../utils';

export default {
  namespace: 'rechargeDetails',
  state: {
    consumeReportList: [],
    loading: false,
    typeList: [],
    aclStoreList: [],
  },

  reducers: {
    save(state, { rechargeReportList }) {
      return { ...state, rechargeReportList };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },
    memberTypeList(state, { typeList }) {
      return {
        ...state,
        typeList,
      };
    },
    aclStoreList(state, { aclStoreList }) {
      return {
        ...state,
        aclStoreList,
      };
    },
  },

  effects: {
    * fetchRechargeReport({ values }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(rechargeDetails.rechargeReport, {
        ...values,
      });
      if (data.success) {
        yield put({
          type: 'save',
          rechargeReportList: data.data,
        });
      }
    },
    * memberTypeListData({ payload }, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(rechargeDetails.memberTypeList, {
        tenantId: memberTenantId.tenantId,
      });
      if (data.success) {
        yield put({
          type: 'memberTypeList',
          typeList: data.data,
        });
      }
    },
    * fetchAclStoreList({ payload }, { call, put }) {
      const { data } = yield call(rechargeDetails.aclStoreList);
      if (data.success) {
        yield put({
          type: 'aclStoreList',
          aclStoreList: data.data,
        });
      }
    },
    * exportExcel({ excelValue }, { call }) {
      const values = encodeURIComponent(JSON.stringify(excelValue));
      yield call(rechargeDetails.exportExcel, {
        values,
      });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/member/rechargeDetails') {
          dispatch({
            type: 'memberTypeListData',
          });
          dispatch({
            type: 'fetchAclStoreList',
          });
        }
      });
    },
  },

};
