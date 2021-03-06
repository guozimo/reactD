import { parse } from 'qs';
import { message } from 'antd';
import { create, remove, update, query } from '../../services/inventory/supplierType';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'supplierType',
  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
    modalError: false,
    modalErrorValue: null,
    searchWord: null,
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
        if (location.pathname === '/stock/supplierType') {
          dispatch({
            type: 'query',
            payload: { ...location.query, rows: 10 },
          });
          dispatch({
            type: 'querySuccess',
            payload: { searchWord: null },
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
            list: data.data.data.page.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.page.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload });
      if (data.data && data.data.success) {
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data.data && data.data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },
    * update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const id = yield select(({ supplierType }) => supplierType.currentItem.id);
      const newSupplierType = { ...payload, id };
      const data = yield call(update, newSupplierType);
      if (data.data && data.data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },
    * reload(action, { put, select }) {
      const pagination = yield select(state => state.supplierType.pagination);
      const queryString = yield select(state => state.supplierType.searchWord);
      yield put({ type: 'query', payload: { ...action.payload, page: pagination.current, rows: pagination.size, queryString } });
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
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
        modalKey: Date.parse(new Date()) / 1000,
      };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};
