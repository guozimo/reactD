import { parse } from 'qs';
import { message } from 'antd';
import { query, exports } from '../../services/inventory/reportDish';
import { queryTime, queryDepot } from '../../services/inventory/common';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'reportDish',
  state: {
    list: [],
    depotList: [],
    storeId: null,
    loading: false,
    rows: 10,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    startDateValue: null,
    endDateValue: null,
    endDateOpen: false,
    preCnt: 0,
    nextDate: null,
    startDateOn: true,
    serverTime: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/reportDish') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
          });
          dispatch({
            type: 'queryDate',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.totalCount,
              current: data.data.data.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.aclStoreList,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDate({ payload }, { call, put }) {
      const data = yield call(queryTime, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            serverTime: data.data.data.substr(0, 10),
          },
        });
      }
    },
    * exports({ payload }, { call }) {
      yield call(exports, payload);
    },
    * reload(action, { put, select }) {
      const pagination = yield select(state => state.reportDish.pagination);
      const storeId = yield select(state => state.reportDish.storeId);
      yield put({ type: 'query', payload: { ...action.payload, page: pagination.current, rows: pagination.size, storeId } });
    },
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};
