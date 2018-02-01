import * as memberDetailsService from '../../services/member/memberDetailsContent';
import { getUserInfo } from '../../utils';

export default {
  namespace: 'memberDetails',
  state: {
    list: [],
    typeList: [],
    modalVisible: false,
  },
  reducers: {
    modalShow(state) {
      return {
        ...state,
        modalVisible: true,
      };
    },
    modalHide(state) {
      return {
        ...state,
        modalVisible: false,
      };
    },
    memberList(state, { list }) {
      return {
        ...state,
        list,
      };
    },
    memberTypeList(state, { typeList }) {
      return {
        ...state,
        typeList,
      };
    },
  },
  effects: {
    * fetchList({ values }, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(memberDetailsService.fetchList, {
        tenantId: memberTenantId.tenantId,
        ...values,
      });
      if (data.success) {
        yield put({
          type: 'memberList',
          list: data.data,
        });
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
    * searchList({ values }, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(memberDetailsService.searchList, {
        tenantId: memberTenantId.tenantId,
        ...values,
      });
      if (data.success) {
        yield put({
          type: 'memberList',
          list: data,
        });
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
    * memberTypeListData(payload, { call, put }) {
      const memberTenantId = getUserInfo();
      const { data } = yield call(memberDetailsService.memberTypeList, {
        tenantId: memberTenantId.tenantId,
      });
      if (data.success) {
        yield put({
          type: 'memberTypeList',
          typeList: data.data,
        });
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
    * updateStatus({ values }, { call, put }) {
      const { data } = yield call(memberDetailsService.updateStatus, {
        ...values,
      });
      if (data.success) {
        // console.log(data);
        // yield put({
        //   type: 'fetchList',
        //   values: {page: 1, rows: 10,},
        // });
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
    * downloadTemplate(payload, { call }) {
      const data = yield call(memberDetailsService.downloadTemplate);
      if (data) {
        window.open(data.data.data);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/member/memberDetails') {
          const values = {
            page: 1,
            rows: 10,
          };
          dispatch({
            type: 'fetchList',
            values,
          });

          dispatch({
            type: 'memberTypeListData',
          });
        }
      });
    },
  },
};
